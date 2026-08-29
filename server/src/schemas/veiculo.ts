import { z, ZodLazy } from "zod";

const ANO_MINIMO = 1900;
const ANO_MAXIMO = new Date().getFullYear() + 1;

function numeroNormalizado(schema: z.ZodNumber) {
    return z.preprocess(
        (valor) => {
            if (typeof valor !== "string") {
                return valor;
            }

            const texto = valor.trim();

            if (texto === "") {
                return valor;
            }

            return Number(texto);
        },
        schema
    );
}

const estadoIpvaSchema =
    z.preprocess(
        (valor) => {
            if (typeof valor !== "string") {
                return valor;
            }

            const texto = valor.trim().toLowerCase();

            if (
                texto === "true" ||
                texto === "on"
            ) {
                return true;
            }

            if (
                texto === "false" ||
                texto === "off"
            ) {
                return false;
            }

            return valor;
        },
        z.boolean({
            error: "O estado do IPVA deve ser verdadeiro ou falso.",
        })
    );

const outrasInfosSchema =
    z.preprocess(
        (valor) => {
            if (!Array.isArray(valor)) {
                return valor;
            }

            return valor
                .map((item) =>
                    typeof item === "string"
                        ? item.trim()
                        : item
                )
                .filter(
                    (item) => item !== ""
                );
        },

        z
            .array(
                z
                    .string({
                        error: "Informação adicional inválida.",
                    })
                    .min(
                        1,
                        {
                            error: "Informação adicional vazia.",
                        }
                    )
                    .max(
                        160,
                        {
                            error: "Cada informação adicional deve possuir no máximo 160 caracteres.", 
                        }
                    )
            )
            .max(
                20,
                {
                    error: "São permitidas no máximo 20 informações adicionais.",
                }
            )
    );

const imagensSchema =
    z
        .array(
            z
                .url(
                    "URL de imagem inválida."
                )
                .max(
                    2048,
                    {
                        error: "URL de imagem muito longa.",
                    }
                )
        )
        .max(
            20,
            {
                error: "São permitidas ao máximo 20 imagens.",
            }
        );

const camposVeiculo = {
    nome:
        z
            .string({
                error: "O nome é obrigatório.",
            })
            .trim()
            .min(
                2,
                {
                    error: "O nome deve possuir pelo menos 2 caracteres.",
                }
            )
            .max(
                120,
                {
                    error: "O nome deve possuir no máximo 120 caracteres.",
                }
            ),

    km:
        numeroNormalizado(
            z
                .number({
                    error: "Quilometragem inválida.",
                })
                .int({
                    error: "A quilometragem deve ser inteira.",
                })
                .min(
                    0,
                    {
                        error: "A quilometragem não pode ser negativa.",
                    }
                )
                .max(
                    10_000_000,
                    {
                        error: "Quilometragem inválida.",
                    }
                )
        ),

    cor:
        z
            .string({
                error: "A cor é obrigatória.",
            })
            .trim()
            .min(
                2,
                {
                    error: "A cor é obrigatória.",
                }
            )
            .max(
                50,
                {
                    error: "A cor deve possuir no máximo 50 caracteres.",
                }
            ),

    final_placa:
        numeroNormalizado(
            z
                .number({
                    error: "Final da placa inválido.",
                })
                .int({
                    error: "O final da placa deve ser inteiro.",
                })
                .min(
                    0,
                    {
                        error: "O final da placa deve estar entre 0 e 9.",
                    }
                )
                .max(
                    9,
                    {
                        error: "O final da placa deve estar entre 0 e 9.",
                    }
                )
        ),
    
    estado_ipva:
        estadoIpvaSchema,

    preco:
        numeroNormalizado(
            z
                .number({
                    error: "Preço inválido.",
                })
                .gt(
                    0,
                    {
                        error: "O preço deve ser maior que zero.",
                    }
                )
                .max(
                    100_000_000,
                    {
                        error: "Preço inválido.",
                    }
                )
        ),

    ano:
        numeroNormalizado(
            z
                .number({
                    error: "Ano inválido.",
                })
                .int({
                    error: "O ano deve ser inteiro.",
                })
                .min(
                    ANO_MINIMO,
                    {
                        error: `O ano deve ser maior ou igual a ${ANO_MINIMO}.`,
                    }
                )
                .max(
                    ANO_MAXIMO,
                    {
                        error: `O ano deve ser menor ou igual a ${ANO_MAXIMO}.`,
                    }
                )
        ),

    cambio:
        z
            .string({
                error: "O câmbio é obrigatório.",
            })
            .trim()
            .min(
                2,
                {
                    error: "O câmbio é obrigatório.",
                }
            )
            .max(
                30,
                {
                    error: "O câmbio deve possuir no máximo 30 caracteres.",
                }
            ),

    motor:
        z
            .string({
                error: "O motor é obrigatório.",
            })
            .trim()
            .min(
                1,
                {
                    error: "O motor é obrigatório.",
                }
            )
            .max(
                30,
                {
                    error: "O motor deve possuir no máximo 30 caracteres.",
                }
            ),

    combustivel:
        z
            .string({
                error: "O combustível é obrigatório.",
            })
            .trim()
            .min(
                2,
                {
                    error: "O combustível é obrigatório.",
                }
            )
            .max(
                30,
                {
                    error: "O combustível deve possuir no máximo 30 caracteres.",
                }
            ),

    descricao:
        z
            .string({
                error: "A descrição é obrigatória."
            })
            .trim()
            .min(
                1,
                {
                    error: "A descrição é obrigatória.",
                }
            )
            .max(
                3000,
                {
                    error: "A descrição deve possuir no máximo 3000 caracteres.",
                }
            ),

    outras_infos:
        outrasInfosSchema,
};

export const criarVeiculoSchema =
    z.strictObject({
        ...camposVeiculo,

        imagens: imagensSchema.default([]),
    });

export const atualizarVeiculoSchema =
    z
        .strictObject(camposVeiculo)
        .partial()
        .refine(
            (dados) =>
                Object.keys(dados).length > 0,
            {
                error: "Informe pelo menos um campo para atualização.",
            }
        );

export const idVeiculoSchema =
    z.strictObject({
        id:
            z
                .string({
                    error: "ID inválido.",
                })
                .trim()
                .regex(
                    /^[1-9]\d*$/,
                    {
                        error: "ID inválido.",
                    }
                )
                .transform(
                    (valor) => Number(valor)
                )
                .refine(
                    Number.isSafeInteger,
                    {
                        error: "ID inválido.",
                    }
                ),
    });

export function formatarErrosZod(erro: z.ZodError) {
    return erro.issues.map(
        (issue) => ({
            campo:
                issue.path.length > 0
                    ? issue.path.join(".")
                    : "body",

            mensagem: issue.message,
        })
    );
}