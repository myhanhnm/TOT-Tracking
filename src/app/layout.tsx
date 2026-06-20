import type { Metadata } from 'next';

import { geistMono, geistSans } from 'src/theme/fonts';

import 'src/styles/_app.scss';
import 'src/styles/_core.scss';
import 'src/styles/tailwind.scss';

import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'Workforce Activity Analytics',
  description: 'Analyze warehouse associate scan activity and identify off-task periods',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
