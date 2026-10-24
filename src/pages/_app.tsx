import { useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { HydrationBoundary, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { createQueryClient } from '@/api/queryClient'
import { AppShell } from '@/shared/components/AppShell'
import '../styles/globals.css'

interface PageProps {
  dehydratedState?: DehydratedState | null
}

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HydrationBoundary state={pageProps.dehydratedState ?? undefined}>
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
