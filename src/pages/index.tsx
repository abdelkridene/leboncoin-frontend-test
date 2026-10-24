import type { ReactElement } from 'react'
import Head from 'next/head'

export default function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>Messages - leboncoin</title>
        <meta name="description" content="Consultez et envoyez vos messages leboncoin" />
      </Head>
      <main>
        <h1>Messages</h1>
      </main>
    </>
  )
}
