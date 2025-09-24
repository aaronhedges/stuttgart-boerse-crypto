import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stuttgart Börse Crypto",
  description: "Tech Challenge by Aaron Hedges",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const KEY='theme';
              const cl = document.documentElement.classList;
              const stored = localStorage.getItem(KEY);
              const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = stored || (sysDark ? 'dark':'light');
              cl.toggle('dark', theme==='dark');
              // keep in sync if user flips system while page is open
              try {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                  if (!localStorage.getItem(KEY)) cl.toggle('dark', e.matches);
                });
              } catch {}
            })();`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
