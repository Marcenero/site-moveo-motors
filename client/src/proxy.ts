import type { NextRequest } from "next/server";

import { updateSession } from "../../supabase/proxy";

export async function proxy(
    request: NextRequest
) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/auth/:path*",
    ]
};