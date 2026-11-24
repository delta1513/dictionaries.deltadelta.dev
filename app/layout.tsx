import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dictionaries",
  description: "Personal glossaries of terms I know, one dictionary per field.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
