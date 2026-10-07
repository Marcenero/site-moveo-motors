import type { NextConfig } from "next";

const isProduction = process.env.VERCEL_ENV === "production";

function getOrigin(value: string | undefined) {
    if (!value) {
        return null;
    }

    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

const apiOrigin = getOrigin(process.env.NEXT_PUBLIC_API_URL);
const supabaseOrigin = getOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);

const connectSrc = [
    "'self'",
    apiOrigin,
    supabaseOrigin,
    "https://*.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://www.facebook.com",
].filter(Boolean);

const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    supabaseOrigin,
    "https://*.tile.openstreetmap.org",
    "https://www.facebook.com",
].filter(Boolean);

const contentSecurityPolicy = [
    "default-src 'self'",

    [
        "script-src",
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://connect.facebook.net",
    ].join(" "),

    "style-src 'self' 'unsafe-inline'",

    `img-src ${imgSrc.join(" ")}`,

    `connect-src ${connectSrc.join(" ")}`,

    "font-src 'self' data:",

    "object-src 'none'",

    "base-uri 'self'",

    "form-action 'self'",

    "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "X-Frame-Options",
        value: "DENY",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
    {
        key: "Content-Security-Policy-Report-Only",
        value: contentSecurityPolicy,
    },
];

if (!isProduction) {
    securityHeaders.push({
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive",
    });
}

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ivkslwgbabkzmpppuscv.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/Imagens/**",
            },
        ],
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;