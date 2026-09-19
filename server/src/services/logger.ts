type logContext = {
    component?: string;
    operation?: string;
    method?: string;
    status?: number;
};

function escreverLog(
    level: "info" | "warn" | "error",
    event: string,
    context: logContext = {},
    error?: unknown
) {
    const log = {
        timestamp: new Date().toISOString(),
        level,
        event,
        ...context,

        ...(error
            ? {
                errorName:
                    error instanceof Error
                        ? error.name
                        : "UnknownError",
            } : {}),
    };

    const mensagem = JSON.stringify(log);

    if (level === "error") {
        console.error(mensagem);
        return;
    }

    if (level === "warn") {
        console.warn(mensagem);
        return;
    }

    console.log(mensagem);
}

export function logError(
    event: string,
    error: unknown,
    context: logContext = {}
) {
    escreverLog(
        "error",
        event,
        context,
        error
    );
}

export function logInfo(
    event: string,
    context: logContext = {}
) {
    escreverLog(
        "info",
        event,
        context
    );
}