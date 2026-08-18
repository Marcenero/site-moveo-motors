import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = "/admin";

      redirectUrl.search = "";

      return NextResponse.redirect(
        redirectUrl
      );
    }

    console.error(
      "Erro ao confirmar login:",
      {
        code: error.code,
        name: error.name,
        message: error.message,
      }
    );
  }

  const loginUrl = request.nextUrl.clone();

  loginUrl.pathname = "/admin/login";

  loginUrl.search = "";

  loginUrl.searchParams.set(
    "error",
    "auth"
  );

  return NextResponse.redirect(
    loginUrl
  );
}