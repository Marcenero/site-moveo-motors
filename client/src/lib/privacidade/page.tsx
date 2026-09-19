"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-[#f5f5f2] text-black">
            <Header />

            <main className="pt-28 pb-24">
                {/* Cabeçalho */}
                <section className="max-w-5xl mx-auto px-6 mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-3">
                        Política de Privacidade
                    </h1>

                    <p className="text-gray-500 mt-5 max-w-2xl leading-relaxed">
                        Entenda como informações pessoais podem ser utilizadas e
                        protegidas durante sua interação com a Moveo Motors.
                    </p>

                    <p className="text-sm text-gray-400 mt-4">
                        Última atualização: 11 de agosto de 2026
                    </p>
                </section>

                {/* Conteúdo */}
                <section className="max-w-5xl mx-auto px-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12 space-y-10">
                        <PrivacidadeSecao titulo="1. Sobre esta política">
                            <p>
                                A Moveo Motors valoriza a privacidade de clientes,
                                visitantes e demais usuários de seus canais digitais.
                            </p>

                            <p>
                                Esta Política apresenta, de forma clara, como dados
                                pessoais poderão ser utilizados durante a interação
                                com nosso site e nossos canais de atendimento.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="2. Dados que poderão ser tratados">
                            <p>
                                Dependendo da interação realizada pelo usuário, poderão
                                ser utilizados dados como:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>nome;</li>
                                <li>telefone;</li>
                                <li>endereço de e-mail;</li>
                                <li>informações fornecidas voluntariamente em mensagens;</li>
                                <li>informações relacionadas a veículos para avaliação, troca ou consignação;</li>
                                <li>dados necessários para solicitações de financiamento, quando aplicável;</li>
                                <li>endereço IP;</li>
                                <li>informações sobre navegador e dispositivo;</li>
                                <li>informações técnicas relacionadas navegação.</li>
                            </ul>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="3. Como os dados podem ser obtidos">
                            <p>
                                Os dados poderão ser fornecidos pelo próprio usuário
                                durante interações como:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>contato pelo WhatsApp;</li>
                                <li>contato por telefone ou e-mail;</li>
                                <li>preenchimento de formulários;</li>
                                <li>solicitação de informações sobre um veículo;</li>
                                <li>solicitação de avaliação de veículo usado;</li>
                                <li>demonstração de interesse em financiamento;</li>
                                <li>solicitação de serviços.</li>
                            </ul>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="4. Finalidades do tratamento">
                            <p>
                                As informações poderão ser utilizadas, quando
                                necessárias, para:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>responder dúvidas e solicitações;</li>
                                <li>prestar atendimento;</li>
                                <li>fornecer informações sobre veículos;</li>
                                <li>agendar visitas ou atendimentos;</li>
                                <li>realizar avaliações de veículos;</li>
                                <li>dar continuidade a negociações;</li>
                                <li>encaminhar solicitações de financiamento, quando solicitado;</li>
                                <li>cumprir obrigações legais;</li>
                                <li>prevenir fraudes;</li>
                                <li>proteger a segurança do site;</li>
                                <li>melhorar nossos serviços e atendimento.</li>
                            </ul>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="5. Compartilhamento de informações">
                            <p>
                                A Moveo Motors não comercializa dados pessoais.
                            </p>

                            <p>
                                Quando necessário para a prestação de determinado
                                serviço, informações poderão ser compartilhadas com
                                prestadores e parceiros, como:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>instituições financeiras, quando solicitado financiamento;</li>
                                <li>fornecedores de infraestrutura tecnológica;</li>
                                <li>serviços de comunicação e atendimento;</li>
                                <li>prestadores necessários à execução de sercviços;</li>
                                <li>autoridades públicas, quando houver obrigação legal.</li>
                            </ul>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="6. Financiamento">
                            <p>
                                Caso seja solicitado financiamento, determinadas
                                informações poderão ser encaminhadas para instituições
                                financeiras responsáveis pela análise da proposta.
                            </p>

                            <p>
                                Aprovação, recusa e condições de crédito são decisões
                                da instituição financeira responsável.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="7. Cookies">
                            <p>
                                O site poderá utilizar cookies e tecnologias semelhantes
                                necessários ao seu funcionamento ou destinados a melhorar
                                a experiência de navegação.
                            </p>

                            <p>
                                Caso sejam utilizados cookies de análise, publicidade ou
                                outras categorais não essenciais, o visitante poderá ser
                                informado e, quando aplicável, poderá gerenciar suas
                                preferências.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="8.Plataformas externas">
                            <p>
                                O site poderá direcionar o usuário para serviços externos,
                                como WhatsApp, Instagram, Facebook e Google Maps.
                            </p>

                            <p>
                                O tratamento realizado após o acesso a essas plataformas
                                estará sujeito às respectivas políticas de privacidade.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="9. Armazenamento">
                            <p>
                                Os dados serão mantidos pelo período necessário para
                                atender às finalidades que justificaram sua utilização,
                                cumprir obrigações legais ou preservar direitos.
                            </p>

                            <p>
                                Quando deixarem de ser necessários, poderão ser eliminados
                                ou anonimizados, quando aplicável.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="10. Segurança">
                            <p>
                                A Moveo Motors busca adotar medidas técnicas e
                                administrativas razoáveis para proteger informações
                                pessoais contra acessos não autorizados, perda, alteração,
                                divulgação ou utilização inadequada.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="11. Direitos do titular">
                            <p>
                                Nos termos da legislação aplicável, o titular poderá
                                solicitar, conforme cada situação:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>confirmação de existência de tratamento;</li>
                                <li>acesso aos seus dados;</li>
                                <li>correção de informações incorretas;</li>
                                <li>informações sobre compartilhamento de dados;</li>
                                <li>eliminação ou anonimização quando aplicável;</li>
                                <li>revogação de consentimento, quando aplicável;</li>
                                <li>demais direitos previstos em lei.</li>
                            </ul>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="12. Comunicações">
                            <p>
                                Quando forem realizadas comunicações comerciais, serão
                                observadas as preferências do usuário e a legislação
                                aplicável.
                            </p>

                            <p>
                                Quando aplicável, o usuário poderá solicitar a interrupção
                                dessas comunicações.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="13. Alterações desta política">
                            <p>
                                Esta Política poderá ser atualizada para acompanhar
                                alterações no site, nos serviços ou na legislação.
                            </p>

                            <p>
                                A versão mais recente permanecerá disponível nesta
                                página.
                            </p>
                        </PrivacidadeSecao>

                        <PrivacidadeSecao titulo="14. Contato">
                            <p>
                                Para dúvidas ou solicitações relacionadas à privacidade
                                e proteção de dados, entre em contato com a Moveo Motors
                                por meio dos canais disponibilizados no site.
                            </p>
                        </PrivacidadeSecao>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function PrivacidadeSecao({
    titulo,
    children,
}: {
    titulo: string,
    children: React.ReactNode;
}) {
    return (
        <section className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-5">
                {titulo}
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
                {children}
            </div>
        </section>
    );
}