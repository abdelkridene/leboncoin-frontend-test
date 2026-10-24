import { useState } from 'react'
import type { AppProps } from 'next/app'
import { HydrationBoundary, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { createQueryClient } from '@/api/queryClient'
import '../styles/globals.css'

interface PageProps {
  dehydratedState?: DehydratedState
}

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
