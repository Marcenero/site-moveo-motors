import type { Metadata } from "next";
import LandingPageClient from "../components/home/LandingPageClient";

export const metadata: Metadata = {
    alternates: {
        canonical: "/",
    },
};

export default function HomePage() {
    return <LandingPageClient />;
}
