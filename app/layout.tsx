import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heaven Land — Control Panel",
  description: "Private control panel for the Heaven Land Discord bot.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-hl-bg text-hl-text antialiased">
        {children}
      </body>
    </html>
  );
}
