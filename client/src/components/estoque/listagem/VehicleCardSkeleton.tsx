export default function VehicleCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg animate-pulse">
            {/* Imagem */}
            <div className="aspect-[16/10] w-full bg-gray-200" />

            {/* Informações */}
            <div className="space-y-4 p-5">
                {/* Nome */}
                <div className="h-6 w-3/4 rounded-md bg-gray-200" />

                {/* Preço */}
                <div className="h-8 w-1/2 rounded-md bg-gray-200" />

                {/* Ano / km / combustível */}
                <div className="flex items-center gap-3">
                    <div className="h-4 w-14 rounded bg-gray-200" />
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                </div>

                {/* Botão */}
                <div className="pt-2">
                    <div className="h-12 w-full rounded-xl bg-gray-200" />
                </div>
            </div>
        </div>
    );
}