import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { 
      data,
      error, 
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (apiUrl) {
        try {
          const respostaAuditoria =
            await fetch(`${apiUrl}/audit/login`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${data.session.access_token}`
              }
            }
          );

          if (!respostaAuditoria.ok) {
            console.error(
              "Falha ao registrar login administrativo:",
              respostaAuditoria.status
            );
          }
        }
        catch (erroAuditoria) {
          console.error(
            "Erro ao registrar login administrativo:",
            erroAuditoria
          );
        }
      }
      else {
        console.error("NEXT_PUBLIC_API_URL não está configurada.");
      }

      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";

      return NextResponse.redirect(redirectUrl);
    }

    if (error) {
      console.error(
        "Erro ao confirmar login:",
        {
          code: error.code,
          name: error.name,
          message: error.message,
        }
      );
    }
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