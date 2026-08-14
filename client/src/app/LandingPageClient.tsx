"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleCard from "../components/estoque/VehicleCard";
import React, { useEffect, useState } from "react";
import type { Veiculo } from "../types/veiculo";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  Car,
  ShieldCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LandingPage() {
  const [veiculosRecentes, setVeiculosRecentes] = useState<Veiculo[]>([]);
  const [carregandoRecentes, setCarregandoRecentes] = useState(true);
  const [mostrarWhatsapp, setMostrarWhatsapp] = useState(false);

  useEffect(() => {
    async function buscarVeiculosRecentes() {
      try {
        //Em produção, trocar para: `${process.env.NEXT_PUBLIC_API_URL}/veiculos/recentes`
        const resposta = await fetch("http://localhost:3001/veiculos");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar veículos");
        }

        const dados = await resposta.json();

        const lista: Veiculo[] = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.veiculos)
            ? dados.veiculos
            : [];

        const destaques = [...lista]
          .sort((a, b) => b.id - a.id)
          .slice(0, 3);

        setVeiculosRecentes(destaques);
      }
      catch (error) {
        console.error("Erro ao buscar veículos em destaque:", error);
        setVeiculosRecentes([]);
      }
      finally {
        setCarregandoRecentes(false);
      }
    }

    buscarVeiculosRecentes();
  }, []);

  useEffect(() => {
    const verificarScroll = () => {
      setMostrarWhatsapp(window.scrollY > 500);
    };

    verificarScroll();

    window.addEventListener("scroll", verificarScroll);

    return () => {
      window.removeEventListener("scroll", verificarScroll);
    };
  }, []);

  const posicao: [number, number] = [-23.535763, -46.786853]; //Localização da loja

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#D9A300] selection:text-white">

      {/* --- HEADER / NAVIGATION --- */}
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[720px] md:min-h-screen py-28 md:py-0 flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
            alt="Carro de Luxo"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left">
            <h1 className="text-white text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
              A EMOÇÃO DE <br />
              <span className="text-[#D9A300] italic">DIRIGIR.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 font-medium max-w-lg leading-relaxed">
              Na <span className="text-[#D9A300] font-bold">MOVEO MOTORS</span>, selecionamos apenas o melhor para si. Veículos premium com garantia e procedência garantida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.href = '/estoque'}
                className="group bg-[#D9A300] hover:bg-white text-black px-10 py-5 rounded-xl text-lg font-black uppercase flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl">
                Ver Estoque <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="border-2 border-white/30 hover:border-[#D9A300] text-white px-10 py-5 rounded-xl text-lg font-black uppercase transition-all hover:bg-white/5">
                Avaliar Meu Usado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE DESTAQUES --- */}
      <section id="estoque" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-row md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text[#D9A300] font-black tracking-widest uppercase text-sm">Catálogo</span>
              <h2 className="text-5xl font-black text-black mt-2 leading-none">Destaques</h2>
            </div>
            <button
              className="group flex items-center gap-2 text-black font-black text-lg border-b-4 border-[#D9A300] pb-1 hover:text-[#C89200] transition-colors"
              onClick={() => window.location.href = '/estoque'}
            >
              VER TODOS OS MODELOS <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {carregandoRecentes ? (
              <p className="text-sm text-gray-500">Carregando destaques...</p>
            ) : veiculosRecentes.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum veículo cadastrado no momento.
              </p>
            ) : (
              veiculosRecentes.map((veiculo) => (
                <VehicleCard key={veiculo.id} veiculo={veiculo} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE CONFIANÇA --- */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#D9A300] to-[#FFFBEA] rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-black">
            <div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8 uppercase tracking-tighter">
                Sua próxima conquista começa aqui.
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <p className="font-bold text-lg">Veículos selecionados com cuidado e transparência.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                    <Zap size={24} />
                  </div>
                  <p className="font-bold text-lg">Avaliação justa e personalizada do seu usado.</p>
                </div>
              </div>
            </div>
            <div className="bg-black p-8 rounded-3xl shadow-2xl">
              <p className="text-[#D9A300] font-black text-2xl mb-4 italic uppercase">Dúvidas?</p>
              <p className="text-gray-400 mb-8 font-medium">Nossos especialistas estão prontos para encontrar o carro ideal para si.</p>
              <button
                className="w-full bg-green-500 text-white px-4 py-5 rounded-2xl font-black text-sm sm:text-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 sm:gap-3 text-center"
                onClick={() => window.open("https://wa.me/5511984481526", "_blank", "noopener,noreferrer")}
              >
                <span className="shrink-0 text-xl sm:text-2xl">
                  <FaWhatsapp />
                </span>
                <span className="leading-tight">CONTATO VIA WHATSAPP</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOSSOS SERVIÇOS --- */}
      <section id="servicos" className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-black text-5xl font-black uppercase italic tracking-tighter">Serviços MOVEO</h2>
                <div className="h-2 w-24 bg-[#D9A300] mx-auto mt-4 rounded-full"></div>
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mt-4 mb-6 leading-[0.95]">
                  Muito além de encontrar seu próximo carro.
              </h2>

              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                  Conheça as soluções que a Moveo Motors oferece para tornar sua experiência automotiva mais simples, segura e completa.
              </p>

              <Link
                  href="/servicos"
                  className="group inline-flex items-center gap-3 bg-[#D9A300] text-black px-8 py-4 rounded-xl font-black uppercase hover:bg-[#111111] hover:text-white transition-all"
              >
                  Conhecer nossos Serviços

                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
          </div>
      </section>

      {/* --- LOCALIZAÇÃO --- */}
      <section id="contato" className="bg-black py-16 md:py-24 px-4 md:px-6 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="relative z-10">
            <span className="text-[#D9A300] font-black tracking-widest uppercase">Onde Estamos</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-4 mb-8 leading-tight md:leading-[0.9] break-words">VENHA VISITAR O NOSSO SHOWROOM</h2>
            <div className="space-y-10">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#D9A300] shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1 uppercase text-[#D9A300]">Atendimento</h4>
                  <p className="text-gray-400 font-medium text-lg leading-snug">(11) 4387-8767<br />(11) 91234-5678</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-[#D9A300] rounded-2xl flex items-center justify-center text-black shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1 uppercase text-[#D9A300]">Localização</h4>
                  <p className="text-gray-400 font-medium text-lg leading-snug">Av. Santo Antônio, 815 - Vila Osasco<br />Osasco, SP - 06083-200</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-0">
            <MapContainer
              center={posicao}
              zoom={15}
              dragging={false}
              touchZoom={false}
              doubleClickZoom={false}
              scrollWheelZoom={false}
              boxZoom={false}
              keyboard={false}
              zoomControl={false}
              className="h-[400px] w-full rounded-2xl"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={posicao}>
                <Popup>
                  Estamos aqui.
                </Popup>
              </Marker>
            </MapContainer>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

      {/* Floating Action Button (WhatsApp) */}
      <a
        href="https://wa.me/5511912345678"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-10 right-10 bg-[#25D366] text-white p-6 rounded-full shadow-[0_15px_40px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 z-[60] group animate-bounce transition-all duration-500 ease-out
            ${
              mostrarWhatsapp
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-10 pointer-events-none"
            }
          `}
      >
        <MessageCircle size={36} fill="white" />
        <span className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-black text-white px-5 py-3 rounded-2xl text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 uppercase tracking-widest">
          Falar com Especialista
        </span>
      </a>

    </div>
  );
}