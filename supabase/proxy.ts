import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest, } from "next/server";

const cookieOptions = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
};

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions,

            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(
                    cookiesToSet,
                    headers
                ) {
                    cookiesToSet.forEach(
                        ({ name, value }) => {
                            request.cookies.set(
                                name,
                                value
                            );
                        }
                    );

                    response = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(
                        ({
                            name,
                            value,
                            options,
                        }) => {
                            response.cookies.set(
                                name,
                                value,
                                options
                            );
                        }
                    );

                    Object.entries(headers).forEach(
                        ([key, value]) => {
                            response.headers.set(
                                key,
                                value
                            );
                        }
                    );
                },
            },
        }
    );

    const { data, error } = await supabase.auth.getClaims();

    const autenticado = !error && Boolean(data?.claims?.sub);

    const pathname = request.nextUrl.pathname;

    const rotaAdminProtegida = pathname === "/admin" ||
        (
            pathname.startsWith("/admin/") &&
            pathname !== "/admin/login"
        );
    
    if (rotaAdminProtegida && !autenticado) {
        const url = request.nextUrl.clone();

        url.pathname = "/admin/login";

        url.search = "";

        url.searchParams.set("error", "session");

        const redirectResponse = NextResponse.redirect(url);

        response.cookies
            .getAll()
            .forEach((cookie) => {
                redirectResponse.cookies.set(cookie);
            });

        for (
            const header of [
                "cache-control",
                "expires",
                "pragma",
            ]
        ) {
            const value = response.headers.get(header);

            if (value) {
                redirectResponse.headers.set(
                    header,
                    value
                );
            }
        }

        return redirectResponse
    }

    return response;
}