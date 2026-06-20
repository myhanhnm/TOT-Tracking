import * as React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { AppProviders } from 'src/providers';
import { geistMono, geistSans } from 'src/theme/fonts';

import 'src/styles/_app.scss';
import 'src/styles/_core.scss';
import 'src/styles/tailwind.scss';

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Head>
        <title>Workforce Activity Analytics</title>
        <meta
          name="description"
          content="Analyze warehouse associate scan activity and identify off-task periods"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProviders>
          <Component {...pageProps} />
        </AppProviders>
      </div>
    </>
  );
}
