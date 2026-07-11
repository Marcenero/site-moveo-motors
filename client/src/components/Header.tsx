import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-[#D9A300]/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section - Moveo Motors */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <img
            src="/Moveo-motors3.png"
            alt="Moveo Motors Logo"
            className="h-30 w-auto md:scale-180 sm:scale-130 transition-transform"
            onClick={() => window.location.href = '/'}
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-white/80 font-semibold text-sm uppercase tracking-widest">
          <a href="/estoque" className="hover:text-[#D9A300] transition-colors">Estoque</a>
          <a href="/servicos" className="hover:text-[#D9A300] transition-colors">Serviços</a>
          <a href="/sobre" className="hover:text-[#D9A300] transition-colors">Sobre Nós</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white hover:text-[#FFFBEA] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:bg-black border-t border-[#D9A300]/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top fade-in duration-300">
          <a href="/estoque" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Estoque</a>
          <a href="/servicos" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Serviços</a>
          <a href="/sobre" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Sobre Nós</a>
        </div>
      )}
    </nav>
  )
}