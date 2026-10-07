"use client";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

const LOCATION_HIGHLIGHT_EVENT = "moveo:highlight-location";

const autoDealerJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",

    "@id": "https://moveomotors.com.br/#autodealer",

    name: "Moveo Motors",

    description: "Revenda de veículos seminovos com procedência e garantia em Osasco, SP.",

    url: "https://moveomotors.com.br",

    image: "https://moveomotors.com.br/og.png",

    telephone: "",

    address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "Osasco",
        addressRegion: "SP",
        postalCode: "",
        addressCountry: "BR",
    },

    openingHoursSpecification: [], //Vazio por enquanto

    sameAs: [
        "https://www.instagram.com/moveomotors",
        //Facebook
    ],

    geo: {
        "@type": "GeoCoordinates",
        latitude: -46.0,
        longitude: -23.0,
    },

    currenciesAccepted: "BRL",
};

export default function SobrePage() {
    const [destacarLocalizacao, setDestacarLocalizacao] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const destacar = () => {
            setDestacarLocalizacao(true);

            clearTimeout(timer);

            timer = setTimeout(() => {
                setDestacarLocalizacao(false);
            }, 2000);
        };

        //Caso tenha vindo de outra página
        if (window.location.hash === "#localizacao") {
            destacar();
        }

        //Caso já esteja na página /sobre
        window.addEventListener(LOCATION_HIGHLIGHT_EVENT, destacar);

        return () => {
            window.removeEventListener(LOCATION_HIGHLIGHT_EVENT, destacar);
            clearTimeout(timer);
        };
    }, []);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(autoDealerJsonLd).replace(/</g, "\\u003c"),
                }}
            />

            <div className="min-h-screen bg-gray-100 font-sans text-black selection:bg-[#D9A300] selection:text-white pt-20">
                <Header />

                <div className="flex bg-gray-300 min-h-width h-[350px]"></div>

                <div className="relative z-10 mx-auto mt-20 max-2-7xl px-6">
                    <div className="relative overflow-hidden rounded-3xl bg-[#f7f4ee] shadow-xl border border-[#d9a300]/20">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D9A300]/10 blur-3xl" />

                        <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-16">
                            {/* Texto principal */}
                            <div>
                                <span className="inline-flex rounded-full border border-[#d9a300]/30 bg-[#d9a300]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#b88900]">
                                    Sobre a Moveo Motors
                                </span>

                                <h2 className="mt-6 max-w-2xl text-3xl font-black leading-tight text-[#171717] md:text-4xl lg:text-5xl">
                                    Mais do que vender carros,
                                    <span className="text-[#d9a300]">
                                        {" "}
                                        criamos relações de confiança.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#5f5f5f] md:text-lg">
                                    Na Moveo Motors, acreditamos que a compra de um veículo é um
                                    marco na vida de nossos clientes. Por isso, cada veículo do
                                    nosso estoque é selecionado criteriosamente, priorizando
                                    qualidade, procedência e segurança em cada negociação.
                                </p>

                                <div className="mt-8 h-1 w-20 rounded-full bg-[#d9a300]" />
                            </div>

                            {/* Missão */}
                            <div className="rounded-2xl border border-[#d9a300]/20 bg-[#fffdf8] p-6 shadow-sm md:p-8">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9a300]">
                                    Nossa missão
                                </p>

                                <p className="mt-4 text-xl font-semibold leading-relaxed text-[#171717] md:text-2xl">
                                    Tornar a compra do seu próximo veículo uma experiência simples,
                                    segura e transparente.
                                </p>

                                <p className="mt-4 text-sm leading-relaxed text-[#6b6b6b] md:text-base">
                                    Nosso atendimento é próximo e humano, buscando entender suas
                                    necessidades para ajudar você a fazer uma escolha com confiança
                                    e tranquilidade.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-20">
                    <div className="border-t border-gray-200 pt-16 text-center mb-16">
                        <h2 className="text-black text-5xl font-black uppercase italic tracking-tighter">
                            Canais de atendimento
                        </h2>
                        <div className="h-2 w-24 bg-[#D9A300] mx-auto mt-4 rounded-full"></div>
                    </div>
                </div>

                <p className="text-gray-500 text-base text-center leading-relaxed">
                    Aqui em baixo você pode escolher a melhor forma de entrar em contato com nós.
                </p>

                <div className=" grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6 pt-15 px-4 mb-24">
                    <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-[#D9A300]">
                        <div className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0">
                            <FiPhone size={30} />
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-gray-500">Telefone</p>
                            <p className="text-base font-semibold text-black">Em breve</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-[#D9A300]">
                        <div className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0">
                            <FiClock size={30} />
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-gray-500">Horário de funcionamento</p>
                            <p className="text-base font-semibold text-black">Em breve</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-[#D9A300]">
                        <div className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0">
                            <FiMail size={30} />
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-base font-semibold text-black">
                                moveomotors@gmail.com
                            </p>
                        </div>
                    </div>

                    <a
                        /* href="https://wa.me/5511NUMERO" */
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-[#D9A300] cursor-pointer"
                    >
                        <div className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-400 transition-colors duration-300">
                            <FaWhatsapp
                                size={30}
                                className="text-black group-hover:text-white transition-colors duration-300"
                            />
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-gray-500">Whatsapp</p>
                            <p className="text-base font-semibold text-black">
                                Clique aqui para entrar em contato
                            </p>
                        </div>
                    </a>

                    <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-[#D9A300]">
                        <div className="flex flex-row justify-center gap-3">
                            <div className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0 hover:bg-blue-400 hover:text-white transition-colors duration-300">
                                <FaFacebookF size={30} />
                            </div>
                            <a
                                href="https://www.instagram.com/moveomotors"
                                className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0 hover:bg-pink-500 hover:text-white transition-colors duration-300"
                            >
                                <FaInstagram size={30} />
                            </a>
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-gray-500">
                                Cheque nossas redes sociais (clique nos ícones)
                            </p>
                            <p className="text-base font-semibold">Facebook e Instagram</p>
                        </div>
                    </div>

                    <a
                        //href="https://share.google/hpbbcHh7iOsKFGfOx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group scroll-mt-80 rounded-2xl transition-all duration-500 ${
                            destacarLocalizacao
                                ? "scale-[1.03] ring-4 ring-[#d9a300]/40 shadow-2xl"
                                : "scale-100 ring-0"
                        }`}
                        id="localizacao"
                    >
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-[#D9A300]">
                            <div className="w-14 h-14 bg-[#D9A300] rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ease-in-out group-hover:bg-black group-hover:text-[#d9a300]">
                                <FiMapPin size={30} />
                            </div>

                            <div className="flex flex-col justify-center">
                                <p className="text-sm text-gray-500">
                                    Localização (Clique aqui para descobrir como chegar lá)
                                </p>
                                <p className="text-base font-semibold text-black">Em breve</p>
                            </div>
                        </div>
                    </a>
                </div>

                <Footer />
            </div>
        </>
    );
}
