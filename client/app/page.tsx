"use client";

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  Car,
  ShieldCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuredCars = [
    {
      id: 1,
      name: "EXEMPLO",
      price: "R$123,00",
      year: "2026",
      km: "12500 km",
      transmission: "Manual",
      image: ""
    },
    // Adicionar carros
    // {
    // id: , name: , price: , year: , km: , transmission: , image:
    //},
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-orange-500 selection:text-white">

      {/* --- HEADER / NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Section - Moveo Motors */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative h-12 w-auto flex items-center">
              {/* Aqui você deve substituir o src pelo caminho real da imagem "Moveo motors.png" no seu projeto public/ */}
              <img
                src="/Moveo-motors.svg" // Placeholder para ícone caso a imagem falhe
                alt="Moveo Motors Logo"
                className="h-15 w-auto invert brightness-0 transition-transform group-hover:scale-110"
                style={{
                  filter: "invert(58%) sepia(84%) saturate(1915%) hue-rotate(1deg) brightness(105%) contrast(106%)" // Filtro para aproximar ao laranja do logo
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col leading-none ml-1">
                <span className="text-white font-black text-2xl tracking-[0.15em] italic">MOVEO</span>
                <div className="flex items-center gap-1">
                  <div className="h-[2px] bg-orange-500 flex-grow"></div>
                  <span className="text-orange-500 font-bold text-[10px] tracking-[0.4em] uppercase">MOTORS</span>
                  <div className="h-[2px] bg-orange-500 flex-grow"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-white/80 font-semibold text-sm uppercase tracking-widest">
            <a href="#estoque" className="hover:text-orange-500 transition-colors">Estoque</a>
            <a href="#servicos" className="hover:text-orange-500 transition-colors">Serviços</a>
            <a href="#sobre" className="hover:text-orange-500 transition-colors">Sobre Nós</a>
            <a href="#contato" className="hover:text-orange-500 transition-colors">Contato</a>
            <button className="bg-orange-500 text-black px-7 py-2.5 rounded-full font-black hover:bg-orange-600 hover:scale-105 transition-all shadow-[0px_0px_15px_rgba(249,115,22,0.3)]">
              LOGIN
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white hover:text-orange-500 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-orange-500/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top fade-in duration-300">
            <a href="#estoque" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Estoque</a>
            <a href="#servicos" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Serviços</a>
            <a href="#sobre" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Sobre</a>
            <a href="#contato" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Contacto</a>
            <button className="bg-orange-500 text-black w-full py-4 rounded-xl font-black">ENTRAR NA CONTA</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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
            <div className="inline-block bg-orange-500 text-black px-4 py-1 rounded-md font-black text-sm mb-6 animate-bounce">
              OFERTA DA SEMANA
            </div>
            <h1 className="text-white text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
              A EMOÇÃO DE <br />
              <span className="text-orange-500 italic">DIRIGIR.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 font-medium max-w-lg leading-relaxed">
              Na <span className="text-orange-500 font-bold">MOVEO MOTORS</span>, selecionamos apenas o melhor para si. Veículos premium com garantia e procedência garantida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 hover:bg-white text-black px-10 py-5 rounded-xl text-lg font-black uppercase flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-orange-500/20">
                Ver Estoque <ArrowRight size={22} />
              </button>
              <button className="border-2 border-white/30 hover:border-orange-500 text-white px-10 py-5 rounded-xl text-lg font-black uppercase transition-all hover:bg-white/5">
                Avaliar Meu Usado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE DESTAQUES --- */}
      <section id="estoque" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-orange-500 font-black tracking-widest uppercase text-sm">Catálogo</span>
              <h2 className="text-5xl font-black text-black mt-2 leading-none">Destaques Moveo</h2>
            </div>
            <button className="group flex items-center gap-2 text-black font-black text-lg border-b-4 border-orange-500 pb-1 hover:text-orange-600 transition-colors">
              VER TODOS OS MODELOS <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredCars.map((car) => (
              <div key={car.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl hover:shadow-orange-500/10 transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 bg-orange-500 text-black px-3 py-1 rounded font-black text-xs">
                    EM ESTOQUE
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-black group-hover:text-orange-500 transition-colors">{car.name}</h3>
                    <span className="text-gray-400 font-bold">{car.year}</span>
                  </div>
                  <div className="flex gap-4 text-gray-400 font-bold text-sm mb-6 italic">
                    <span>{car.km}</span>
                    <span>•</span>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-3xl font-black text-black">{car.price}</span>
                    <button className="p-4 bg-black text-white rounded-2xl group-hover:bg-orange-500 group-hover:text-black transition-all">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE CONFIANÇA --- */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
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
                  <p className="font-bold text-lg">Garantia estendida de procedência MOVEO.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                    <Zap size={24} />
                  </div>
                  <p className="font-bold text-lg">Avaliação do seu usado acima do mercado.</p>
                </div>
              </div>
            </div>
            <div className="bg-black p-8 rounded-3xl shadow-2xl">
              <p className="text-orange-500 font-black text-2xl mb-4 italic uppercase">Dúvidas?</p>
              <p className="text-gray-400 mb-8 font-medium">Nossos especialistas estão prontos para encontrar o carro ideal para si.</p>
              <button className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black text-lg hover:bg-white transition-all flex items-center justify-center gap-3">
                <MessageCircle size={24} /> CONTATO VIA WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOSSOS SERVIÇOS --- */}
      <section id="servicos" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-black text-5xl font-black uppercase italic tracking-tighter">Serviços Premium</h2>
            <div className="h-2 w-24 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(249,115,22,1)] hover:translate-y-[-5px] transition-transform">
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Financiamento</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">Taxas competitivas com aprovação imediata. Trabalhamos com os melhores parceiros financeiros para facilitar a sua vida.</p>
              <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-black transition-all">
                Simular Agora
              </button>
            </div>

            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-5px] transition-transform">
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Consignação</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">Deixe o seu carro conosco e vendemos por si. Marketing profissional e exposição premium para garantir o melhor negócio.</p>
              <button className="bg-orange-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-black hover:text-white transition-all">
                Quero Consignar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOCALIZAÇÃO --- */}
      <section id="contato" className="bg-black py-24 px-6 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <span className="text-orange-500 font-black tracking-widest uppercase">Onde Estamos</span>
            <h2 className="text-6xl font-black mt-4 mb-8 leading-[0.9]">VENHA VISITAR O NOSSO SHOWROOM</h2>
            <div className="space-y-10">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-black shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1 uppercase text-orange-500">Localização</h4>
                  <p className="text-gray-400 font-medium text-lg leading-snug">Av. Santo Antônio, 815 - Vila Osasco<br />Osasco, SP - 06083-200</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1 uppercase text-orange-500">Atendimento</h4>
                  <p className="text-gray-400 font-medium text-lg leading-snug">(11) 4387-8767<br />(11) 91234-5678</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[500px] rounded-[3rem] overflow-hidden border-[12px] border-white/5 relative group shadow-2xl">
            {/* Mapa Customizado */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-46.7844,-23.5325,14/800x600?access_token=none')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-10 bg-orange-500 rounded-full animate-ping opacity-20"></div>
                  <MapPin className="relative text-orange-500 fill-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,1)]" size={64} />
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <p className="text-sm font-bold text-white text-center italic">Aberto de Segunda a Sábado: 09h às 19h</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="sobre" className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex flex-col mb-8">
                <img
                  src="/Moveo-motors.svg"
                  alt="Moveo Motors Logo"
                />
              </div>
              <p className="text-gray-500 font-medium leading-relaxed mb-8 italic">
                A Moveo Motors é sinónimo de exclusividade e paixão automóvel. O seu sonho é o nosso compromisso diário.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-black mb-8 uppercase tracking-widest text-sm border-l-4 border-orange-500 pl-3">Menu</h4>
              <ul className="space-y-4 font-bold text-gray-500">
                <li><a href="#estoque" className="hover:text-orange-500 transition-colors">Novos & Usados</a></li>
                <li><a href="#servicos" className="hover:text-orange-500 transition-colors">Financiamento</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Avaliação Online</a></li>
                <li><a href="#contato" className="hover:text-orange-500 transition-colors">Localização</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-black mb-8 uppercase tracking-widest text-sm border-l-4 border-orange-500 pl-3">Institucional</h4>
              <ul className="space-y-4 font-bold text-gray-500">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Quem Somos</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Trabalhe Conosco</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Termos & Condições</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Privacidade</a></li>
              </ul>
            </div>

            <div className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl">
              <h4 className="font-black mb-4 uppercase text-orange-500 italic">Venda Conosco</h4>
              <p className="text-sm text-gray-400 mb-8 font-medium">Anuncie o seu veículo na melhor montra da região.</p>
              <button className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-black text-sm uppercase hover:bg-orange-500 hover:text-black transition-all">
                Anunciar Agora
              </button>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-400 text-[10px] font-bold text-center md:text-left leading-relaxed max-w-2xl uppercase tracking-tighter">
              As especificações dos veículos estão sujeitas a confirmação. Fotos meramente ilustrativas. Preços anunciados válidos para venda direta sem troca, salvo erro ortográfico.
            </div>
            <p className="text-black font-black text-xs">© 2024 MOVEO MOTORS. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (WhatsApp) */}
      <a
        href="https://wa.me/5511912345678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 bg-[#25D366] text-white p-6 rounded-full shadow-[0_15px_40px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all z-[60] group animate-bounce"
      >
        <MessageCircle size={36} fill="white" />
        <span className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-black text-white px-5 py-3 rounded-2xl text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 uppercase tracking-widest">
          Falar com Especialista
        </span>
      </a>

    </div>
  );
}