import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer id="sobre" className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1">
                <div className="flex flex-col mb-8">
                <img
                    src="/Moveo-motors2.svg"
                    alt="Moveo Motors Logo"
                />
                </div>
                <p className="font-medium leading-relaxed mb-8 italic">
                  A Moveo Motors é sinônimo de exclusividade e paixão automóvel. O seu sonho é o nosso compromisso diário.
                </p>
                <div className="flex gap-4">
                {[FaInstagram, FaFacebookF, FaWhatsapp].map((Icon, idx) => (
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
                As especificações dos veículos estão sujeitas a confirmação. Preços anunciados válidos para venda direta sem troca, salvo erro ortográfico.
            </div>
            <p className="text-black font-black text-xs">© 2026 MOVEO MOTORS. TODOS OS DIREITOS RESERVADOS.</p>
            </div>
          </div>
        </footer>
    );
}