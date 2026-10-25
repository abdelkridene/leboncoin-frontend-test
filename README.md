# leboncoin — Messages

A messaging interface for the [leboncoin frontend technical test](https://github.com/leboncoin/frontend-technical-test): list your conversations, read a conversation, send messages and start new conversations, on desktop and on mobile.

![CI](https://github.com/abdelkridene/leboncoin-frontend-test/actions/workflows/ci.yml/badge.svg)

| | |
|---|---|
| Stack | Next.js 15 (Pages Router), React 19, TypeScript `strict`, TanStack Query 5, zod 4, CSS Modules |
| Tests | 254 tests / 72 suites — Jest, Testing Library, MSW, jest-axe |
| Coverage | 99.9 % statements · 98.8 % branches · 100 % functions · 100 % lines (CI fails below 80 %) |
| Lighthouse | 100 accessibility · 100 best practices · 100 SEO (mobile and desktop, production build) |
| Dependencies | `npm audit`: 0 vulnerabilities |

The original exercise statement is kept in [`docs/EXERCISE.md`](docs/EXERCISE.md).

---

## Getting started

Requirements: Node.js ≥ 20.9 (the CI uses the version in `.nvmrc`).

```bash
npm install
npm run start-server   # mock API on http://localhost:3005
npm run dev            # app on http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js development server / production build / production server |
| `npm run start-server` | json-server mock API, unchanged from the starter |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` / `npm run test:coverage` | Jest / Jest with the enforced coverage thresholds |

- The API URL comes from `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:3005`.
- json-server writes every message you send into `src/server/db.json`. Run `git checkout src/server/db.json` to get the seed data back.
- The logged-in user is `getLoggedUserId()` (user `1`, as in the starter). With the seed data, user 1 already talks with everyone, so creating a conversation only opens the existing one. Switch it to `2` in `src/utils/getLoggedUserId.ts` to see a conversation actually being **created**.

---

## Features

- **Conversation list**: most recent first, with avatar initials, the other person's name and a French date (`14:45`, `Hier`, `6 mai`, `24/12/2020`). The selected conversation is highlighted.
- **Conversation view**:
  - my messages on the right in orange, the other person's on the left in grey, with the time under each bubble;
  - it scrolls to the latest message, and the message field always stays at the bottom, including when the conversation is empty or failed to load.
- **Sending a message**:
  - the message shows up at once with "Envoi…", then is confirmed in place;
  - a failed message stays in the conversation with "Échec de l'envoi — Réessayer" until it is delivered, so nothing typed is ever lost;
  - Enter sends, Shift+Enter adds a new line; a counter appears near the 1000 character limit.
- **Responsive**: from 768 px up, the list and the conversation sit side by side. On mobile, the list comes first, then the conversation full screen with a back button. Checked at 375, 768 and 1280 px.
- **Bonus 1, new conversation**: a dialog lists your contacts. People you already talk with are marked "Conversation en cours" and open that conversation; anyone else gets a new one, opened right away.
- **Bonus 2, server failures**: see [Error handling](#error-handling).

---

## Architecture

```
src/
  api/                 HTTP client, zod schemas, one function per endpoint, query client and keys, SSR prefetch
  features/
    conversations/
      components/      ConversationList/  ConversationListItem/  ConversationsSidebar/  NewConversationDialog/ …
      hooks/           useConversations, useConversationsSidebar, useCreateConversation, useNewConversation, …
      helpers/         getInterlocutor, getRecipientOptions, mergeConversations, sortByLastMessage
    messages/
      components/      ConversationPanel/  ConversationThread/  MessageList/  MessageBubble/  MessageComposer/ …
      hooks/           useMessages, useSendMessage, useMessageComposer, useConversationThread, useConversationPanel, …
      helpers/         sortByTimestamp, validateMessageBody, formatRemainingCharacters
  shared/
    components/        AppShell/  AppLayout/  Button/  Avatar/  EmptyState/  ErrorState/  ErrorBoundary/  Timestamp/ …
    hooks/             useMediaQuery, useIsMobile, useOnlineStatus, useTimeZone, useFocusOnNavigation, useDebouncedValue, …
    helpers/           formatDate, parseRouteId, captureError, cn
  pages/               _app (providers + persistent shell), index, conversations/[conversationId], 404
  styles/              tokens.css (design tokens), globals.css
  test/                stateful MSW handlers and fixtures, render helpers
```

**Every component lives in its own folder** with its styles and its tests: `ConversationList/ConversationList.tsx`, `ConversationList.module.css`, `ConversationList.test.tsx`. Hooks and helpers are single files, each with its test next to it.

**Data flow**: `api/*` (fetch, timeout, zod validation) → TanStack Query hooks → presentational components.

- **Components only render.** A screen-level component calls exactly one feature hook (`useConversationThread`, `useConversationPanel`, `useConversationsSidebar`, `useNewConversation`) and passes plain data and callbacks down to presentational components.
- **Hooks hold the logic**: fetching, sending, retrying, focus management, what can be sent and when.
- **Helpers are pure functions**: date formatting, sorting, validation, finding the other person in a conversation.
- No function or component is longer than 70 lines, tests included (ESLint `max-lines-per-function`).
- Page tests are the one exception to colocation: they live in `src/__tests__/pages/`, because Next.js would publish a test file placed in `pages/` as a route.

### Rendering and routing

- `/` shows the list; `/conversations/[conversationId]` shows a conversation.
- Both pages prefetch their data in `getServerSideProps`, so the HTML arrives filled in.
  - The prefetch has a **1.5 s budget**. A slow or broken API never blocks the page: what misses the budget is cancelled on the server and fetched by the browser.
  - On **client-side navigations** the server prefetch is skipped (`x-nextjs-data` header): the browser cache is already warm, and prefetching again would double the API load.
- An id that is not a positive integer, or a conversation the user does not have, gets a real **404**. On client-side navigations, where nothing was prefetched, the page shows a dedicated "Conversation introuvable" state instead.
- The header (`AppShell`) is rendered once in `_app`, so it doesn't re-mount on navigation.

### Dates and time zones

The server and the browser rarely share a time zone (servers usually run in UTC). Formatting with the machine's zone made the server render one time and the browser expect another.

- Every formatter takes an explicit time zone, and "today" or "Hier" are computed on the calendar of that zone, which keeps them right on daylight saving days.
- `useTimeZone` returns `Europe/Paris` during server rendering and hydration, so both produce the same HTML, then the browser's own zone. A user in Paris sees no change; a user elsewhere sees the time switch to their own zone right after hydration.

---

## Technical choices

| Choice | Why | Alternatives considered |
|---|---|---|
| **TanStack Query** | Caching, request deduplication, retries with backoff, cancellation through `AbortSignal`, server prefetch and hydration, mutation state for the optimistic UI. Writing that by hand with `useEffect` is where bugs happen. | `useEffect` + `useState` (race conditions, no cache); SWR (weaker mutations); RTK Query (heavier for this scope) |
| **zod** | The API is **not trusted**: every response is parsed at runtime and a malformed payload becomes a clean error state. Types are inferred from the schemas, so they can't drift. Also validates the user's input. | Hand-written type guards (verbose); TypeScript types only (no runtime protection) |
| **CSS Modules + design tokens** | Built into Next.js, no runtime cost, scoped class names. Colors, spacings, radii, sizes, opacities and durations come from `tokens.css`. Literal values left in stylesheets are techniques, not design (visually hidden 1 px boxes, `100%` fills), plus media query breakpoints, which CSS variables cannot express. | Tailwind; CSS-in-JS (the starter had just removed styled-components) |
| **Pages Router** (kept) | The starter uses it and it covers the needs (SSR and hydration). | App Router with React Server Components |
| **MSW** for tests | Tests run the real `fetch`, the real HTTP client and the real zod parsing. The handlers are stateful, like the real API: what is posted comes back on the next GET. | `jest.mock` of the API modules (misses integration bugs) |
| **Native `<dialog>`** | Focus trap, Esc, backdrop and focus return come from the browser. | A UI library (weight), a hand-made modal (easy to get the accessibility wrong) |

**Deliberately not added**: a UI kit, a date library (`Intl` covers it), a form library (one field), virtualization (see [Known limits](#known-limits)) and Playwright.

**Version notes**
- MSW is pinned to `~2.10.5`: MSW 3 needs TypeScript ≥ 5.9, which the ESLint TypeScript plugin doesn't accept yet, and MSW ≥ 2.11 ships ESM-only packages that Jest 29 can't load without a chain of transforms.
- `postcss` is overridden to `^8.5.31`: Next.js 15 pins a version with known advisories. The generated CSS is byte-for-byte identical.
- `jest-fixed-jsdom` restores the fetch and stream globals that jsdom hides and MSW needs.

---

## Safety guards

- **Runtime validation**: every API response goes through zod. Unknown fields are dropped (the users' `token` never reaches the client), wrong shapes throw `InvalidResponseError`, and the UI shows an error state.
- **HTTP client** (`src/api/httpClient.ts`): a single `request()` for every call, a **10 s timeout** (`TimeoutError`), the caller's `AbortSignal` forwarded (an already aborted signal never sends anything), `HttpError(status)` on non-2xx answers, `InvalidResponseError` on non-JSON bodies.
- **No race conditions**: each query gets TanStack Query's `AbortSignal`, so switching conversation cancels the previous request, and data is stored per conversation key.
- **User input**: trimmed, blank messages refused, 1000 characters at most (`maxLength` plus zod).
- **No double send**: the send button is disabled while a message is in flight and Enter is ignored meanwhile.
- **Nothing sent blind**: sending is blocked until the conversation's history has loaded, so a sent message can never pass for the whole conversation.
- **Server as the source of truth**: after a message is delivered, or a conversation created, the related query is invalidated and refetched.
- **Escaped output**: user content is rendered as text. `dangerouslySetInnerHTML` is banned by ESLint (`react/no-danger`), and a test checks that HTML in a message is not interpreted.
- **Route validation**: `conversationId` must be a positive integer; otherwise the server answers 404.
- **Security headers** (`next.config.js`): a strict CSP (no inline scripts, no `eval` in production, `connect-src` limited to the API, `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and no `X-Powered-By`. zod runs in `jitless` mode because the CSP forbids the `eval` it would probe.
- **No hard-coded secrets**: the API URL comes from an environment variable and `.env*` files are git-ignored.
- **Dependencies**: `npm audit` reports no vulnerability, in production and development dependencies alike.

---

## Error handling

The infrastructure is "a bit shaky", so the app assumes the API can fail at any time.

| Situation | Behavior |
|---|---|
| A GET fails (5xx, timeout, network) | Retried up to 3 times with exponential backoff (1 s, 2 s, 4 s, capped at 8 s). 4xx answers and invalid payloads are not retried. |
| Still failing, nothing cached | A friendly `ErrorState` — "Oups, c'est nous, pas vous" — with **Réessayer**. |
| Still failing, data already cached | The cached data **stays visible**, with a "Connexion instable" notice and **Actualiser**. |
| Sending a message fails | The message stays in the conversation, marked "Échec de l'envoi", until it is delivered: it survives sending other messages and moving between conversations. **Réessayer** sends it again, stamped with the new time. Messages are never retried automatically, since a POST is not idempotent. |
| The history of a conversation cannot load | The draft is kept, sending waits for the history, and **Réessayer** reloads it. |
| The device goes offline | An offline banner appears. Messages sent meanwhile wait ("Envoi…") and go out when the connection returns. |
| A component throws while rendering | Each panel has its own `ErrorBoundary`: the error is reported (`captureError`, the single place to plug Sentry), the panel shows `ErrorState`, and it starts afresh on the next page. |
| The API is down during server rendering | The page still renders and the browser takes over. |

---

## Accessibility

Target: **WCAG 2.1 AA**.

- **Semantic HTML**: `header`, `main`, `nav`, `section`, `ul/li`, `form`, real buttons and links, `lang="fr"`, a single `h1` per page. On mobile, the open conversation hides the header visually only, so the `h1` stays available.
- **Messages** are in a `role="log"` region with `aria-live="polite"`. Each bubble starts with a visually hidden "Vous :" or "<Nom> :". The region is focusable, so a long history can be scrolled with the keyboard in every browser.
- **Labels and states**: every field is labelled, the selected conversation has `aria-current="page"`, loading skeletons use `role="status"` and errors `role="alert"`. Page titles name the other person, which is what the route announcer reads on navigation.
- **Character counter**: the visible counter updates at once but is hidden from screen readers. A separate polite live region announces the count once typing pauses, as in the GOV.UK character count pattern.
- **Keyboard and focus**:
  - an "Aller au contenu" skip link, and a visible focus ring everywhere (an `outline`, so shadows can't hide it);
  - opening a conversation moves the focus to its heading. A full page load keeps the browser's default focus instead;
  - going back on mobile puts the focus on the conversation you came from;
  - after sending or retrying a message, the focus is in the message field;
  - the dialog traps focus and Esc closes it.
- **Contrast**: the brand orange `#EC5A13` on white is only 3.5:1, so text and buttons use a darker `#C8490C` (4.8:1). The brand orange is kept for accents.
- **Touch targets** are at least 44 px, and `prefers-reduced-motion` turns animations off.
- **Automated checks**: `jest-axe` on every main component and page, and Lighthouse accessibility at 100.

---

## Performance

- Server rendering with prefetched data, and skeletons rather than a blank screen.
- `staleTime` of 30 s (5 min for the users): no refetch storm when moving between conversations.
- **Messages are prefetched** when a conversation is hovered or focused, so opening it is usually instant.
- Per-route JavaScript splitting comes from Next.js (`/conversations/[id]` is about 4 kB on top of the shared bundle).
- The logo goes through `next/image` with `priority`, once, in the persistent shell.
- Measured on a throttled mobile profile (4× CPU, Fast 4G), production build: **LCP ≈ 410 ms, CLS 0**.
- No `useMemo`/`useCallback` sprinkled around: lists are small, and TanStack Query's `select` and structural sharing already avoid useless renders.

---

## Testing strategy

- **Helpers**: plain unit tests with edge cases: time zones and daylight saving days, invalid ids, blank or too long input, French plurals.
- **Hooks**: `renderHook` in a real `QueryClientProvider`, against MSW. They cover optimistic sending, failure then retry, failed messages outliving the cache's garbage collection (fake timers), cancellation of the previous conversation's request, and server prefetches cut at the render budget.
- **Components**: Testing Library and `user-event`, from the user's point of view (roles and accessible names), each with a `jest-axe` assertion.
- **Server rendering**: `renderToString` followed by `hydrateRoot` checks that dates hydrate without mismatch and that a full page load does not move the focus.
- **Pages**: rendering and `getServerSideProps` (404s, prefetch, API down, client-side navigations).
- Unhandled requests fail the test (`onUnhandledRequest: 'error'`), and the in-memory API is reset after each test.
- **Coverage gate**: 80 % on statements, branches, functions and lines, set in `jest.config.js`.
- **CI** (`.github/workflows/ci.yml`): install → lint → typecheck → tests with coverage → build, on every push and pull request.

---

## Known limits

- **Mock server quirks.** The mock server is used as provided, unmodified.
  - `GET /conversations/:userId` is answered by a middleware that reads `db.json` **once at startup**, so conversations created afterwards are never listed. The app keeps the conversations it created in a separate cache entry and merges them into the list. After a full page reload they are gone until the mock restarts, the conversation's URL answers 404, and picking the same contact again creates a second conversation, because the client can no longer know about the first.
  - The mock does not update `lastMessageTimestamp` when a message is posted. The app moves the conversation to the top after sending, until the next refresh of the list.
  - json-server doesn't copy route parameters into the stored record, so the POST bodies carry `conversationId`, `authorId` and the full conversation. The swagger says `Message.timestamp` is a string while the data uses numbers; both are accepted.
- **Identity** comes from `getLoggedUserId()`, and `authorId` is sent by the client. A real API must take the user from the session.
- **No idempotency key**: if the server records a message but its answer times out, "Réessayer" sends it twice. A client-generated id checked by the server would fix it.
- **Failed messages live in memory**: they survive navigation inside the app, not a reload.
- **No real-time**: the other person's messages appear on the next refetch (after sending, on window focus, on navigation).
- **No pagination** and **no virtualization**: rendering a few hundred bubbles is cheap. Virtualization becomes worth it past roughly 1,000 messages in one conversation, or when profiling shows long tasks on scroll, together with cursor pagination (`useInfiniteQuery` + `@tanstack/react-virtual`).

## With more time

- **Real authentication**: a session cookie, with the user id read on the server instead of `getLoggedUserId()`.
- **Real-time**: WebSocket or SSE pushing new messages into the TanStack Query cache (`setQueryData`), with read receipts and typing indicators.
- **Reliable delivery**: client-generated message ids for idempotent retries, and an outbox persisted across reloads.
- **Pagination and virtualization** for long conversations and long lists.
- **i18n**: the copy is French only. Extract it with `next-intl` or similar; dates already go through `Intl`.
- **End-to-end tests** with Playwright against the mock API (main flows, offline mode, mobile viewport, server down), plus visual regression tests.
- **Monitoring**: Sentry behind `captureError`, and Web Vitals reporting.
