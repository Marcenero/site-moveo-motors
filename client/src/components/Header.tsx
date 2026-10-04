"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-[#D9A300]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo Section - Moveo Motors */}
          <div className="flex items-center shrink-0">
            <Link href="/">
              <img
                src="/Moveo-motors3.png"
                alt="Moveo Motors Logo"
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-white/80 font-semibold text-sm uppercase tracking-widest">
            <Link
              href="/estoque"
              className="hover:text-[#D9A300] transition-colors"
            >
              Estoque
            </Link>
            <Link
              href="/servicos"
              className="hover:text-[#D9A300] transition-colors"
            >
              Serviços
            </Link>
            <Link
              href="/sobre"
              className="hover:text-[#D9A300] transition-colors"
            >
              Sobre Nós
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden shrink-0 text-white hover:text-[#FFFBEA] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-[#D9A300]/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top fade-in duration-300">
            <Link
              href="/estoque"
              className="text-white text-lg font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Estoque
            </Link>
            <Link
              href="/servicos"
              className="text-white text-lg font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              href="/sobre"
              className="text-white text-lg font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nós
            </Link>
          </div>
        )}
      </nav>

      {/* Fundo clicável */}
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
        />
      )}
    </>
  );
}
