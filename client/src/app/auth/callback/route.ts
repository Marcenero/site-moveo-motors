import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../lib/auth/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const destination = new URL("/admin", request.url);

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) return NextResponse.redirect(destination);
    }
    return NextResponse.redirect(new URL("/admin/login?error=auth", request.url));
}
