import * as React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document(): React.ReactElement {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
