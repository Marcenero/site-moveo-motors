import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/env.server";

export default function robots(): MetadataRoute.Robots {
    const isProduction = process.env.VERCEL_ENV === "production";

    if (!isProduction) {
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            }
        };
    }

    const siteUrl = getSiteUrl();

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
