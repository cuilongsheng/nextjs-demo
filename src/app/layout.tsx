import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import SWRGlobalConfig from "@/components/SWRConfig";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>
          <SWRGlobalConfig>{children}</SWRGlobalConfig>
        </Providers>
      </body>
    </html>
  );
}
