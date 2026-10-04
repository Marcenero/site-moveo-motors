import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Car,
  ClipboardCheck,
  Handshake,
  Landmark,
  MessageCircle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const whatsappNumber = "5511999999999";

function buildWhatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

type DestaqueServico = "white" | "gold" | "black";

type Servico = {
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string;
  itens: string[];
  botao: string;
  href: string;
  destaque: DestaqueServico;
  icone: LucideIcon;
};

const servicos: Servico[] = [
  {
    slug: "compra",
    categoria: "Compra",
    titulo: "Seminovos premium",
    descricao:
      "Selecionamos veículos com atenção à procedência, conservação e histórico para oferecer mais segurança na sua escolha.",
    itens: [
      "Veículos criteriosamente selecionados",
      "Vistoria e análise de procedência",
      "Informações transparentes sobre cada veículo",
    ],
    botao: "Ver estoque",
    href: "/estoque",
    destaque: "black",
    icone: Car,
  },
  {
    slug: "venda",
    categoria: "Venda",
    titulo: "Consignação inteligente",
    descricao:
      "Conte com a Moveo para apresentar, divulgar e conduzir a negociação do seu veículo com praticidade e transparência.",
    itens: [
      "Apresentação profissional do veículo",
      "Divulgação em canais selecionados",
      "Acompanhamento durante a negociação",
    ],
    botao: "Quero consignar",
    href: buildWhatsappLink("Olá! Tenho interesse em consignar meu veículo."),
    destaque: "gold",
    icone: Handshake,
  },
  {
    slug: "avaliacao",
    categoria: "Avaliação",
    titulo: "Compro o seu usado",
    descricao:
      "Nós avaliamos seu carro e fazemos uma oferta justa. Pagamento em até 24h após a inspeção presencial.",
    itens: [
      "Avaliação personalizada do seu veículo",
      "Proposta baseada nas condições do carro",
      "Possibilidade de venda ou troca",
    ],
    botao: "Avaliar meu usado",
    href: buildWhatsappLink("Olá! Gostaria de avaliar meu usado."),
    destaque: "white",
    icone: ClipboardCheck,
  },
  {
    slug: "credito",
    categoria: "Crédito",
    titulo: "Financiamento facilitado",
    descricao:
      "Trabalhamos com diversos bancos parceiros para encontrar a condição que faz sentido para você.",
    itens: [
      "Consulta a instituições financeiras parceiras",
      "Simulação conforme o seu perfil",
      "Condições sujeitas à análise de crédito",
    ],
    botao: "Consultar opções",
    href: buildWhatsappLink("Olá! Gostaria de discutir um financiamento."),
    destaque: "white",
    icone: Landmark,
  },
];

const etapas = [
  {
    numero: "01",
    titulo: "Você chama a Moveo",
    texto: "Entre em contato pelo WhatsApp ou escolha um veículo no estoque.",
  },
  {
    numero: "02",
    titulo: "Avaliamos o cenário",
    texto: "Entendemos se você quer comprar, vender, trocar ou financiar.",
  },
  {
    numero: "03",
    titulo: "Cuidamos do processo",
    texto:
      "Orientamos você ao longo da negociação, documentação e entrega do veículo.",
  },
];

// Larguras alternadas para criar o layout em "bento" no desktop
const larguraDosCards = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
];

const temas: Record<
  DestaqueServico,
  {
    card: string;
    categoria: string;
    descricao: string;
    caixaIcone: string;
    iconeCheck: string;
    numeroFundo: string;
    divisoria: string;
    botao: string;
  }
> = {
  white: {
    card: "bg-white text-black border border-black/5",
    categoria: "text-gray-500",
    descricao: "text-gray-600",
    caixaIcone: "bg-[#F5F5F2] text-black",
    iconeCheck: "text-[#D9A300]",
    numeroFundo: "text-black/[0.04]",
    divisoria: "border-black/5",
    botao: "bg-black text-white hover:bg-[#D9A300] hover:text-black",
  },
  gold: {
    card: "bg-[#D9A300] text-black",
    categoria: "text-black/60",
    descricao: "text-black/75",
    caixaIcone: "bg-black text-[#D9A300]",
    iconeCheck: "text-black",
    numeroFundo: "text-black/[0.07]",
    divisoria: "border-black/10",
    botao: "bg-black text-[#D9A300] hover:bg-white hover:text-black",
  },
  black: {
    card: "bg-[#111111] text-white",
    categoria: "text-[#D9A300]",
    descricao: "text-gray-400",
    caixaIcone: "bg-[#D9A300] text-black",
    iconeCheck: "text-[#D9A300]",
    numeroFundo: "text-white/[0.04]",
    divisoria: "border-white/10",
    botao: "bg-[#D9A300] text-black hover:bg-white",
  },
};

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F2] text-black pt-20">
      <Header />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-20 md:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 mb-5">
              <span className="h-px w-8 bg-[#D9A300]" />O que fazemos
            </p>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              Quatro serviços.
              <br />
              <span className="text-[#D9A300]">Um padrão.</span>
            </h1>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Da escolha do veículo à negociação, buscamos oferecer um
              atendimento transparente, cuidadoso e próximo em cada etapa.
            </p>

            <nav className="mt-6 flex flex-wrap gap-2">
              {servicos.map((servico) => (
                <a
                  key={servico.slug}
                  href={`#${servico.slug}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-black hover:bg-black hover:text-white"
                >
                  {servico.categoria}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {servicos.map((servico, index) => (
            <ServicoCard
              key={servico.slug}
              servico={servico}
              numero={String(index + 1).padStart(2, "0")}
              largura={larguraDosCards[index]}
            />
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="rounded-[2rem] bg-[#111111] text-white p-8 md:p-14">
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D9A300] mb-4">
              Como funciona
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Simples do primeiro contato à entrega.
            </h2>
          </div>

          <div className="relative mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Linha conectando as etapas (desktop) */}
            <div className="hidden md:block absolute top-6 left-6 right-[calc(33.333%-1.5rem)] h-px bg-gradient-to-r from-[#D9A300] via-white/20 to-white/10" />

            {etapas.map((etapa, index) => (
              <div key={etapa.numero} className="relative flex md:block gap-5">
                {/* Linha vertical (mobile) */}
                {index < etapas.length - 1 && (
                  <div className="md:hidden absolute left-6 top-12 h-[calc(100%+2.5rem)] w-px bg-white/10" />
                )}

                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D9A300] bg-[#111111] text-sm font-black text-[#D9A300]">
                  {etapa.numero}
                </div>

                <div className="md:mt-6">
                  <h3 className="font-black text-xl">{etapa.titulo}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-xs">
                    {etapa.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-6 mt-5 mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[2rem] bg-[#D9A300] p-8 md:p-12">
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Não sabe por onde começar?
            </h2>
            <p className="mt-2 text-sm md:text-base text-black/70">
              Fale com a gente e indicamos o melhor caminho para o seu caso.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsappLink("Olá! Gostaria de falar com a Moveo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-4 text-xs font-black uppercase tracking-wider text-[#D9A300] transition hover:bg-white hover:text-black"
            >
              <MessageCircle size={16} />
              Chamar no WhatsApp
            </a>
            <Link
              href="/estoque"
              className="inline-flex items-center gap-2 rounded-xl border border-black/20 px-6 py-4 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
            >
              Ver estoque
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ServicoCard({
  servico,
  numero,
  largura,
}: {
  servico: Servico;
  numero: string;
  largura: string;
}) {
  const tema = temas[servico.destaque];
  const Icone = servico.icone;

  return (
    <article
      id={servico.slug}
      className={[
        "group relative overflow-hidden rounded-[2rem] p-7 md:p-10 flex flex-col scroll-mt-28",
        "transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10",
        tema.card,
        largura,
      ].join(" ")}
    >
      {/* Número grande ao fundo */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute -right-2 -top-6 select-none text-[9rem] md:text-[11rem] font-black leading-none",
          tema.numeroFundo,
        ].join(" ")}
      >
        {numero}
      </span>

      <div className="relative flex items-center gap-4">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-6",
            tema.caixaIcone,
          ].join(" ")}
        >
          <Icone size={22} strokeWidth={2.2} />
        </div>

        <p
          className={[
            "text-[10px] font-black uppercase tracking-[0.35em]",
            tema.categoria,
          ].join(" ")}
        >
          {servico.categoria}
        </p>
      </div>

      <h2 className="relative mt-8 text-3xl md:text-4xl font-black tracking-tight leading-none">
        {servico.titulo}
      </h2>

      <p
        className={[
          "relative mt-4 text-sm md:text-base leading-relaxed max-w-lg",
          tema.descricao,
        ].join(" ")}
      >
        {servico.descricao}
      </p>

      <ul
        className={[
          "relative mt-7 space-y-3 border-t pt-7",
          tema.divisoria,
        ].join(" ")}
      >
        {servico.itens.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm font-semibold"
          >
            <CheckCircle2
              size={18}
              className={["mt-0.5 shrink-0", tema.iconeCheck].join(" ")}
            />
            {item}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-9">
        <ServicoLink
          href={servico.href}
          className={[
            "inline-flex items-center gap-2 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-wider transition",
            tema.botao,
          ].join(" ")}
        >
          {servico.botao}
          {servico.href.startsWith("http") ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
        </ServicoLink>
      </div>
    </article>
  );
}

function ServicoLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
