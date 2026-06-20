import * as React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { AppProviders } from 'src/providers';
import { geistMono, geistSans } from 'src/theme/fonts';

import 'src/styles/_app.scss';
import 'src/styles/_core.scss';
import 'src/styles/tailwind.scss';

type PageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout): React.ReactElement {
  const getLayout = Component.getLayout ?? ((page) => page);

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
        <AppProviders>{getLayout(<Component {...pageProps} />)}</AppProviders>
      </div>
    </>
  );
}
