import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/env.server";

export default function robots(): MetadataRoute.Robots {
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