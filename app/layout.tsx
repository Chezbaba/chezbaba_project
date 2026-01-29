import type { Metadata, Viewport } from "next";
import HolyLoader from "holy-loader";

// styles
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";

// components

import { Toaster } from "@/components/ui/sonner";
import Providers from "@/app/providers";
import ChatComponent from "@/components/common/ChatComponent";
import Navbar from "@/components/common/Navbar";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "MEGA SHOP",
  description: "Ecommerce store built with Next.js",
};

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body className={satoshi.className}>
        <HolyLoader color="#868686" />
        <Providers>
          <Navbar />
          {children}
          <Toaster />
          <ChatComponent />
        </Providers>
      </body>
    </html>
  );
}
