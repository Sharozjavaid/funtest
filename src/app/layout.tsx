import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "BarkBoard",
  description: "A dog-walking social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${nunito.variable} antialiased bg-cream text-bark min-h-screen`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
