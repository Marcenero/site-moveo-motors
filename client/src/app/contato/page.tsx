"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const posicao = [-23.535763, -46.786853]; //Localização da loja

export default function EstoquePage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-black selection:bg-orange-500 selection:text-white pt-20">
            
            <Header />

            <div className="bg-white shadow-md p-6 text-left">
                <h2 className="flex flex-col text-6xl font-bold leading-tight">
                    <span className="text-black">Canais de</span>
                    <span className="text-orange-500">Atendimento</span>
                </h2>

                <p className="mt-3 text-gray-500 text-base leading-relaxed">
                    Aqui você pode escolher a melhor forma de entrar em contato com nós.
                </p>
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6 pt-15 px-4 mb-24">
                <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-orange-500">
                    <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0"><FiPhone size={30} /></div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="text-base font-semibold text-black">11 3023-2141</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-orange-500">
                    <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0"><FiClock size={30} /></div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Horário de funcionamento</p>
                        <p className="text-base font-semibold text-black">Seg. a Sex.: 8h-17h</p>
                        <p className="text-base font-semibold text-black">Sáb. e Dom.: 10h-16h</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-orange-500">
                    <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0"><FiMail size={30} /></div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base font-semibold text-black">exemplo@gmail.com</p>
                    </div>
                </div>

                <a
                    href="https://wa.me/5511984481526"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-orange-500 hover:bg-green-500 hover:border-green-500 transition-all duration-300 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 group-hover:text-white group-hover:bg-green-300"><FaWhatsapp size={30} /></div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Whatsapp</p>
                        <p className="text-base font-semibold text-black group-hover:text-white">Clique aqui para entrar em contato</p>
                    </div>
                </a>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-orange-500">
                    <div className="flex flex-row justify-center gap-3">
                        <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 hover:bg-blue-400 hover:text-white"><FaFacebookF size={30} /></div>
                        <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 hover:bg-pink-500 hover:text-white"><FaInstagram size={30} /></div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Cheque nossas outras redes sociais</p>
                        <p className="text-base font-semibold">Facebook e Instagram</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-md border-2 border-orange-500">
                    <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shrink-0"><FiMapPin size={30} /></div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Localização</p>
                        <p className="text-base font-semibold text-black">Avenida Santo Antônio, 815</p>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
}