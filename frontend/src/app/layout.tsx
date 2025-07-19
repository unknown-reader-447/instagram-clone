import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram",
  description: "Create an account or log in to Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.",
  icons: {
    icon: [
      {
        url: "/images/insta_logo_4.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/insta_logo_4.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "/images/insta_logo_4.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/insta_logo_4.png" type="image/png" />
        <link rel="shortcut icon" href="/images/insta_logo_4.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/insta_logo_4.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
