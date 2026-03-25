import { Search } from "lucide-react";

export default function SearchBox() {
    return (
        <div className="w-full flex justify-center">
            <section className="w-[97%] max-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-black text-black uppercase mb-6">
                    Filtrar veículos
                </h2>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">Marcas</label>
                        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Selecione</option>
                            <option value="toyota">Toyota</option>
                            <option value="honda">Honda</option>
                            <option value="volkswagen">Volkswagen</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">Faixa de preço</label>
                        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Selecione</option>
                            <option value="0-50000">Até R$50.000</option>
                            <option value="50001-100000">R$50.001 a R$100.000</option>
                            <option value="100001-200000">R$100.001 a R$200.000</option>
                            <option value="200000+">Acima de R$200.000</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">Ano</label>
                        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Selecione</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">Câmbio</label>
                        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Selecione</option>
                            <option value="automatico">Automático</option>
                            <option value="manual">Manual</option>
                            <option value="cvt">CVT</option>
                        </select>
                    </div>
                </div>

                {/* Busca + botão */}
                <div className="flex flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por nome, modelo, ..."
                            className="w-full border border-gray-300 rounded-xl px-4 py-4 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <button className="bg-orange-500 hover:bg-black text-black hover:text-white font-black uppercase px-8 py-4 rounded-xl transition-all hover:scale-105 flex items-center gap-2">
                        Buscar
                        <Search size={20}/>
                    </button>
                </div>
            </section>
        </div>
    );
}