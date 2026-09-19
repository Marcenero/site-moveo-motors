import "dotenv/config";
import * as Sentry from "@sentry/node";

import { sanitizarDados } from "./services/sentrySanitizer.js";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    environment: process.env.NODE_ENV ?? "development",

    tracesSampleRate:
        process.env.NODE_ENV === "production"
            ? 0.1
            : 1.0,

    enableLogs: false,

    dataCollection: {
        //Não coleta automaticamente dados do usuário
        userInfo: false,

        cookies: false,

        httpHeaders: {
            request: false,
            response: false,
        },

        //Não envia bodies das requisições/respostas
        httpBodies: [],

        urlQueryParams: false,

        databaseQueryData: false,

        graphQL: {
            document: false,
            variables: false,
        },

        genAI: {
            inputs: false,
            outputs: false,
        },

        stackFrameVariables: false,
    },

    beforeBreadcrumb(breadcrumb) {
        return sanitizarDados(
            breadcrumb
        ) as typeof breadcrumb;
    },

    beforeSend(event) {
        return sanitizarDados(
            event
        ) as typeof event;
    },
});