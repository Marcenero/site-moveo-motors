"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f2] text-black">
            <Header />

            <main className="pt-28 pb-24">
                {/* Cabeçalho */}
                <section className="max-w-5xl mx-auto px-6 mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-3">
                        Termos e Condições
                    </h1>

                    <p className="text-gray-500 mt-5 max-w-2xl leading-relaxed">
                        Estes termos apresentam as principais condições para
                        utilização do site e de seus recursos.
                    </p>

                    <p className="text-sm text-gray-400 mt-4">
                        Última atualização: 11 de agosto de 2026
                    </p>
                </section>

                {/* Conteúdo */}
                <section className="max-w-5xl mx-auto px-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12 space-y-10">
                        <TermoSecao titulo="1. Finalidade do site">
                            <p>
                                O site da Moveo Motors tem como objetivo apresentar
                                informações institucionais, veículos disponíveis em
                                estoque, serviços oferecidos, canais de atendimento e
                                demais informações relacionadas às atividades da empresa.  
                            </p>

                            <p>
                                A utilização do site, por si só, não representa a
                                celebração automática de contrato de compra e venda,
                                financiamento, consignação ou qualquer outro negócio.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="2. Informações sobre os veículos">
                            <p>
                                A Moveo Motors busca manter as informações apresentadas
                                nos anúncios corretas e atualizadas, incluindo preço,
                                ano, quilometragem, características, fotografias e
                                demais informações relevantes.
                            </p>

                            <p>
                                A disponibilidade de cada veículo deverá ser confirmada
                                durante o atendimento ou antes da conclusão da negociação.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="3. Fotografias">
                            <p>
                                As fotografias disponibilizadas no site têm como objetivo
                                representar os veículos anunciados da forma mais fiel possível.
                            </p>

                            <p>
                                Podem ocorrer pequenas diferenças de tonalidade em razão
                                de iluminação, câmera, tela ou dispositivo utilizado
                                pelo visitante.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="4. Preços e condições comerciais">
                            <p>
                                Os preços e condições apresentados correspondem às
                                informações disponíveis no momento da publicação.
                            </p>

                            <p>
                                Formas de pagamento, financiamento, avaliação de veículo
                                usado e demais condições serão apresentadas ao cliente
                                antes da formalização da negociação.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="5. Financiamento">
                            <p>
                                Quando disponível, a Moveo Motors poderá auxiliar no
                                encaminhamento de solicitações para instituições
                                financeiras parceiras.
                            </p>

                            <p>
                                Aprovação de crédito, taxas, quantidade de parcelas,
                                valores, entrada e demais condições são definidas pela 
                                instituição financeira responsável.
                            </p>

                            <p>
                                O envio de uma solicitação não representa garantia de
                                aprovação.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="6. Avaliação de veículo usado">
                            <p>
                                Avaliações realizadas antes da inspeção presencial do
                                veículo poderão possuir caráter preliminar.
                            </p>

                            <p>
                                A proposta definitiva poderá considerar fatores como 
                                estado de conservação, documentação, histórico,
                                quilometragem, versão, acessórios e condições de mercado.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="7. Serviços e consignação">
                            <p>
                                Os serviços apresentados no site estão sujeitos à
                                disponibilidade e às condições comerciais informadas
                                durante o atendimento.
                            </p>

                            <p>
                                Serviços que exijam contratação específica poderão
                                possuir termos, condições e documentos próprios.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="8. Canais de atendimento">
                            <p>
                                O site poderá disponibilizar links para Whatsapp,
                                telefone, e-mail, redes sociais e outros meios de
                                comunicação.
                            </p>

                            <p>
                                As informações enviadas voluntariamente nesses canais
                                poderão ser utilizadas para atendimento e continuidade
                                da solicitação realizada pelo próprio interessado.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="9. Links externos">
                            <p>
                                O site poderá conter links para plataformas de terceiros,
                                incluindo Whatsapp, Instagram, Facebook, Google Maps e
                                outros serviços.
                            </p>

                            <p>
                                Ao acessar plataformas externas, o usuário também estará
                                sujeito aos termos e políticas desses serviços.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="10. Uso adequado do site">
                            <p>
                                O usuário compromete-se a utilizar este site de maneira
                                lícita, responsável e compatível com sua finalidade.
                            </p>

                            <p>
                                Não é permitido tentar acessar áreas restritas sem
                                autorização, interferir no funcionamento do sistema ou
                                realizar atividades destinadas a prejudicar a empresa,
                                seus usuários ou terceiros.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="11. Propriedade intelectual">
                            <p>
                                Salvo indicação em contrário, identidade visual, textos,
                                elementos gráficos e demais conteúdos próprios da Moveo
                                Motors não poderão ser utilizados comercialmente sem
                                autorização.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="12. Disponibilidade do site">
                            <p>
                                A Moveo Motors busca manter o site disponível e
                                funcionando adequadamente, mas poderão ocorrer
                                interrupções temporárias para manutenção, atualizações
                                ou em razão de serviços de terceiros.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="13. Alterações destes termos">
                            <p>
                                Estes Termos poderão ser atualizados para acompanhar
                                mudanças no site, nos serviços oferecidos ou na
                                legislação aplicável.
                            </p>

                            <p>
                                A versão mais recente permanecerá disponível nesta
                                página.
                            </p>
                        </TermoSecao>

                        <TermoSecao titulo="14. Contato">
                            <p>
                                Em caso de dúvidas relacionadas a estes Termos, entre em
                                contato com a Moveo Motors por meio dos canais
                                disponibilizados no site.
                            </p>
                        </TermoSecao>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function TermoSecao({
    titulo,
    children,
}: {
    titulo: string;
    children: React.ReactNode;
}) {
    return (
        <section className="border-b border-gray-100 pb-10 last: border-b-0 last:pb-0">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-5">
                {titulo}
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
                {children}
            </div>
        </section>
    );
}