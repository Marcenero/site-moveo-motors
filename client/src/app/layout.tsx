import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Moveo Motors - Seminovos premium em Osasco",
    template: "%s | Moveo Motors",
  },
  description: "Carros seminovos com procedência e garantia. " +
    "Visite o nosso showroom em Osasco/SP",
  metadataBase: new URL("https://moveomotors.com.br"),
  openGraph: {
    title: "Moveo Motors",
    description: "Seminovos premium com procedência.",
    images: ["/og.png"],
    locale: "pt_BR",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
