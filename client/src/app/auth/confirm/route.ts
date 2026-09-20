import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../../../supabase/server";

import { logError } from "../../../lib/logger";

import { getApiUrl } from "../../../lib/env.server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { 
      data,
      error, 
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const apiUrl = getApiUrl();

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
            logError(
              "admin_login_audit_request_failed",
              error,
              {
                  component: "auth",
                  operation: "registrar_login_admin",
                  status: respostaAuditoria.status,
              }
            );
          }
        }
        catch {
          logError(
            "admin_login_audit_failed",
            error,
            {
              component: "auth",
              operation: "registrar_login_admin",
            }
          );
        }
      }
      else {
        logError(
          "api_url_missing",
          undefined,
          {
            component: "configuration",
            operation: "confirmar_login",
          }
        );
      }

      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";

      return NextResponse.redirect(redirectUrl);
    }

    if (error) {
      logError(
        "login_confirmation_failed",
        error,
        {
          component: "auth",
          operation: "confirmar_login",
          code: error.code,
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