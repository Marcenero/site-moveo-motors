export type Veiculo = {
    id: number;
    nome: string;
    ano: number;
    preco: number;
    km: number;
    combustivel: string;

    imagem?: string;
    imagens?: string[];

    cambio: string;
    motor?: string;
    portas?: string;
    cor?: string;
    descricao?: string;
    final_placa?: number;
    lugares?: number;
    estado_ipva?: boolean;
    aceita_troca?: boolean;
};