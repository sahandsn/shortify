import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import { TRPCReactProvider } from "@/trpc/react";
import { Header } from "@/components/common/header";
import { DESCRIPTION, TITLE } from "@/assets";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <body>
        <TRPCReactProvider>
          <Header />
          {children}
          <Toaster closeButton richColors />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
