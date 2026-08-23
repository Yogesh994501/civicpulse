import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicPulse — Real-Time Municipal Operations & Issue Command Center',
  description: 'Futuristic municipal civic telemetry, automated SLA dispatch tracking, and live neighborhood issue resolution radar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-zinc-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
