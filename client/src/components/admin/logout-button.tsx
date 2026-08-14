"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../../client";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const supabase = createClient();

        await supabase.auth.signOut();

        router.push("/admin/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
            Sair
        </button>
    );
}