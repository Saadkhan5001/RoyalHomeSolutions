import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Home Solutions, Inc. — Find your dream home",
  description:
    "Explore top property listings, get expert guidance, and make your dream home a reality with Royal Home Solutions, Inc. Where everyone is treated like royalty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="overflow-x-hidden font-sans antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
