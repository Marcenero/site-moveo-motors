type logContext = {
    component?: string;
    operation?: string;
    status?: number;
    code?: string;
};

export function logError(
    event: string,
    error: unknown,
    context: logContext = {}
) {
    console.error(
        JSON.stringify({
            timestamp: new Date().toISOString(),

            level: "error",

            event,

            ...context,

            ...(error !== undefined
                ? {
                    errorName:
                        error instanceof Error
                            ? error.name
                            : "UnknownError",
                }
                : {}),
        })
    );
}