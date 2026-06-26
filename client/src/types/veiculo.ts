export type ImagemVeiculo = {
    id: number;
    url: string;
};

export type Veiculo = {
    id: number;
    
    nome: string;
    ano: number;
    preco: number;
    km: number;
    combustivel: string;
    imagens: ImagemVeiculo[];

    cambio: string;
    motor: string;
    cor: string;
    descricao?: string;
    final_placa: number;
    estado_ipva: boolean;
    outras_infos?: string[];

    vendido: boolean;
    data_venda: string | null;
}