type GraficoVendasProps = {
  dados: {
    dia: string;
    vendidos: number;
  }[];
};

export default function GraficoVendas({ dados }: GraficoVendasProps) {
  if (!dados || dados.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhum dado de venda disponível.
      </p>
    )
  }

  const largura = 600;
  const altura = 240;
  const paddingX = 42;
  const paddingY = 32;

  const maiorValor = Math.max(...dados.map((item) => item.vendidos), 1);

  const linhasY = Array.from({ length: maiorValor + 1 }).map((_, valor) => {
    const y =
      altura - paddingY - (valor / maiorValor) * (altura - paddingY * 2);

    return { valor, y };
  });

  const pontos = dados.map((item, index) => {
    const x =
      paddingX +
      (index * (largura - paddingX * 2)) / Math.max(dados.length - 1, 1);

    const y =
      altura - paddingY - (item.vendidos / maiorValor) * (altura - paddingY * 2);

    return { ...item, x, y };
  });

  const linha = pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ");

  const area =
    `${pontos[0].x},${altura - paddingY} ` +
    pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ") +
    ` ${pontos[pontos.length - 1].x},${altura - paddingY}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        className="h-72 w-[90%]"
        role="img"
        aria-label="Gráfico de veículos vendidos nos últimos 5 dias"
      >
        <defs>
          <linearGradient id="vendasGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {linhasY.map((linhaY) => (
          <g key={linhaY.valor}>
            <line
              x1={paddingX}
              x2={largura - paddingX}
              y1={linhaY.y}
              y2={linhaY.y}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />

            <text
              x={paddingX - 12}
              y={linhaY.y + 4}
              textAnchor="end"
              className="fill-gray-400 text-xs"
            >
              {linhaY.valor}
            </text>
          </g>
        ))}

        <polygon points={area} fill="url(#vendasGradient)" />

        <polyline
          points={linha}
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {pontos.map((ponto) => (
          <g key={ponto.dia}>
            <circle
              cx={ponto.x}
              cy={ponto.y}
              r="6"
              fill="#ffffff"
              stroke="#6ee7b7"
              strokeWidth="3"
            />

            <text
              x={ponto.x}
              y={altura - 8}
              textAnchor="middle"
              className="fill-gray-500 text-xs"
            >
              {ponto.dia}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}