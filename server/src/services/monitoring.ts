import * as Sentry from "@sentry/node";

export function capturarErro(
    erro: unknown,
    component: string,
    operation: string
) {
    Sentry.withScope((scope) => {
        scope.setTag(
            "component",
            component
        );

        scope.setTag(
            "operation",
            operation
        );

        Sentry.captureException(erro);
    });
}