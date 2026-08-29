import { z } from "zod";
export declare const criarVeiculoSchema: z.ZodObject<{
    imagens: z.ZodDefault<z.ZodArray<z.ZodURL>>;
    nome: z.ZodString;
    km: z.ZodPreprocess<z.ZodNumber, unknown>;
    cor: z.ZodString;
    final_placa: z.ZodPreprocess<z.ZodNumber, unknown>;
    estado_ipva: z.ZodPreprocess<z.ZodBoolean, unknown>;
    preco: z.ZodPreprocess<z.ZodNumber, unknown>;
    ano: z.ZodPreprocess<z.ZodNumber, unknown>;
    cambio: z.ZodString;
    motor: z.ZodString;
    combustivel: z.ZodString;
    descricao: z.ZodString;
    outras_infos: z.ZodPreprocess<z.ZodArray<z.ZodString>, unknown>;
}, z.core.$strict>;
export declare const atualizarVeiculoSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    km: z.ZodOptional<z.ZodPreprocess<z.ZodNumber, unknown>>;
    cor: z.ZodOptional<z.ZodString>;
    final_placa: z.ZodOptional<z.ZodPreprocess<z.ZodNumber, unknown>>;
    estado_ipva: z.ZodOptional<z.ZodPreprocess<z.ZodBoolean, unknown>>;
    preco: z.ZodOptional<z.ZodPreprocess<z.ZodNumber, unknown>>;
    ano: z.ZodOptional<z.ZodPreprocess<z.ZodNumber, unknown>>;
    cambio: z.ZodOptional<z.ZodString>;
    motor: z.ZodOptional<z.ZodString>;
    combustivel: z.ZodOptional<z.ZodString>;
    descricao: z.ZodOptional<z.ZodString>;
    outras_infos: z.ZodOptional<z.ZodPreprocess<z.ZodArray<z.ZodString>, unknown>>;
}, z.core.$strict>;
export declare const idVeiculoSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strict>;
export declare function formatarErrosZod(erro: z.ZodError): {
    campo: string;
    mensagem: string;
}[];
//# sourceMappingURL=veiculo.d.ts.map