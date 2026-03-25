"use client";

import Header from "../../components/Header";
import SearchBox from "../../components/estoque/SearchBox";
import { Search } from "lucide-react";

export default function EstoquePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-orange-500 selection:text-white pt-24">
            
            <Header />

            <SearchBox />

        </div>
    );
}