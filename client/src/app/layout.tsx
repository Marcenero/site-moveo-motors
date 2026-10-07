import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getSiteUrl } from "../lib/env.server";

import CookieConsent from "../components/privacidade/CookieConsent";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),

    title: {
        default: "Moveo Motors - Seminovos em Osasco",
        template: "%s | Moveo Motors",
    },

    description:
        "Encontre carros seminovos com procedência e garantia na Moveo Motors. Confira nosso estoque e visite o showroom em Osasco, SP.",

    robots: {
        index: isProduction,
        follow: isProduction,

        googleBot: {
            index: isProduction,
            follow: isProduction,
            noimageindex: !isProduction,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    openGraph: {
        title: "Moveo Motors - Seminovos em Osasco",
        description:
            "Seminovos premium com procedência e garantia. Confira o estoque da Moveo Motors em Osasco, SP.",
        url: "/",
        siteName: "Moveo Motors",
        images: [
            {
                url: "/Moveo-motors2.png",
                width: 1200,
                height: 630,
                alt: "Moveo Motors - Seminovos em Osasco",
            },
        ],
        locale: "pt_BR",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Moveo Motors - Seminovos em Osasco",
        description: "Carros seminovos com procedência e garantia em Osasco, SP.",
        images: ["/Moveo-motors2.png"],
    },

    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}

                <CookieConsent />
            </body>
        </html>
    );
}
