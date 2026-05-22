"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchBox from "../../components/estoque/SearchBox";
import VehicleGrid from "../../components/estoque/VehicleGrid";
import { veiculos } from "../../data/veiculos";

export default function EstoquePage() {
    return (
        <div className="min-h-screen bg-[#F5F5F2] font-sans text-black selection:bg-[#D9A300] selection:text-black pt-24">

            <Header />

            <div className="max-w-7xl mx-auto px-6">
                <SearchBox />
                <VehicleGrid veiculos={veiculos} />
            </div>

            <Footer />

        </div>
    );
}