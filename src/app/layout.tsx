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
    <html lang="en" className={openSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
