import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-orange-500/20">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo Section - Moveo Motors */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative h-12 w-auto flex items-center">
                {/* Aqui você deve substituir o src pelo caminho real da imagem "Moveo motors.png" no seu projeto public/ */}
                  <img
                    src="./Moveo-motors.png" // Placeholder para ícone caso a imagem falhe
                    alt="Moveo Motors Logo"
                    className="h-30 w-auto invert brightness-0 transition-transform"
                    style={{
                      filter: "invert(58%) sepia(84%) saturate(1915%) hue-rotate(1deg) brightness(105%) contrast(106%)" // Filtro para aproximar ao laranja do logo
                    }}
                    onClick={() => window.location.href = '/'}
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
                <a href="#contato" className="hover:text-orange-500 transition-colors">Contato</a>
                <a href="#sobre" className="hover:text-orange-500 transition-colors">Sobre Nós</a>
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
                <a href="#contato" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Contato</a>
                <a href="#sobre" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Sobre Nós</a>
                <button className="bg-orange-500 text-black w-full py-4 rounded-xl font-black">ENTRAR NA CONTA</button>
              </div>
            )}
            </nav>
    )
}