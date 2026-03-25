"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchBox from "../../components/estoque/SearchBox";
import VehicleGrid from "../../components/estoque/VehicleGrid";
import { veiculos } from "../../data/veiculos";

export default function EstoquePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-orange-500 selection:text-white pt-24">
            
            <Header />

            <SearchBox />

            <VehicleGrid veiculos={veiculos} />

            <Footer />

        </div>
    );
}