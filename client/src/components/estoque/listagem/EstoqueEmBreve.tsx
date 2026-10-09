import { IconCar } from "@tabler/icons-react";

export default function EstoqueEmBreve() {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 px-6 py-14 md:px-10 md:py-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFFBEA] text-[#D9A300] flex items-center justify-center">
                <IconCar size={30} strokeWidth={2} />
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#D9A300]">
                Pré-lançamento
            </p>

            <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight">
                Estamos preparando nosso estoque
            </h2>

            <p className="mt-3 max-w-lg mx-auto text-sm md:text-base text-gray-500 leading-relaxed">
                Em breve, você poderá conferir aqui os veículos disponíveis na Moveo Motors.
            </p>
        </div>
    );
}