/*
  app/layout.tsx

  Root shell for every route in the App Router. The lab keeps this file small so
  page-level examples can clearly show which route controls each rendering mode.
*/
import type { Metadata } from "next";
import "./globals.css";

/*
  Root layout for the App Router.

  Next.js wraps every route in this layout. Global CSS is imported here because
  App Router expects app-wide styles to be loaded from the root layout.
*/
export const metadata: Metadata = {
  title: "Next.js Rendering Lab",
  description: "Visual demonstrations of CSR, SSR, SSG, and ISR in the Next.js App Router."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
