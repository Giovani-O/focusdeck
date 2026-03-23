import type { Metadata } from 'next';
import { Chivo_Mono } from 'next/font/google';
import './globals.css';

const chivoMono = Chivo_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'FocusDeck - Pomodoro Timer',
  description: 'A Pomodoro-style focus timer with session tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${chivoMono.variable} min-h-full flex flex-col antialiased bg-gray-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}