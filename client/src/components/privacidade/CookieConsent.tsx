"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

type Consent = "accepted" | "rejected" | null;

const COOKIE_NAME = "moveo_cookie_consent";
const SIX_MONTHS = 60 * 60 * 24 * 180;

const COOKIE_PREFERENCES_EVENT = "moveo:open-cookie-preferences";
const COOKIE_CONSENT_CHANGE_EVENT = "moveo:cookie-consent-change";

function getConsent(): Consent {
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_NAME}=`));

    if (!cookie) {
        return null;
    }

    const value = cookie.split("=")[1];

    if (value === "accepted" || value === "rejected") {
        return value;
    }

    return null;
}

function saveConsent(value: Exclude<Consent, null>) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie =
        `${COOKIE_NAME}=${value}; ` +
        `Path=/; ` +
        `Max-Age=${SIX_MONTHS}; ` +
        `SameSite=Lax${secure}`;

    // Notifica o React de que a preferência mudou
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGE_EVENT));
}

// Inscrição nas mudanças de consentimento
function subscribeConsent(callback: () => void) {
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, callback);
    };
}

//Valor usado durante a renderização no servidor
function getServerConsent(): Consent {
    return null;
}

// Detecta quando o componente já está no navegador
function subscribeHydration() {
    return () => {};
}

function getClientSnapshot() {
    return true;
}

function getServerHydrationSnapshot() {
    return false;
}

export default function CookieConsent() {
    const consent = useSyncExternalStore(
        subscribeConsent,
        getConsent,
        getServerConsent
    );

    const initialized = useSyncExternalStore(
        subscribeHydration,
        getClientSnapshot,
        getServerHydrationSnapshot
    );

    const [preferencesOpen, setPreferencesOpen] = useState(false);

    useEffect(() => {
        function openPreferences() {
            setPreferencesOpen(true);
        }

        window.addEventListener(
            COOKIE_PREFERENCES_EVENT,
            openPreferences
        );

        return () => {
            window.removeEventListener(
                COOKIE_PREFERENCES_EVENT,
                openPreferences
            );
        };
    }, []);

    function acceptCookies() {
        saveConsent("accepted");
        setPreferencesOpen(false);
    }

    function rejectCookies() {
        const previousConsent = consent;

        saveConsent("rejected");
        setPreferencesOpen(false);

        if (previousConsent === "accepted") {
            window.location.reload();
            return;
        }
    }

    if (!initialized) {
        return null;
    }

    return (
        <>
            {consent === "accepted" && <TrackingScripts />}

            {(consent === null || preferencesOpen) && (
                <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-5xl rounded-2xl border border-[#d9a300]/30 bg-white p-5 shadow-2xl md:p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-black text-black">
                                Sua privacidade é importante
                            </h2>

                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                Utilizamos cookies opcionais para entender como nosso site é
                                utilizado e melhorar nossas ações de divulgação por meio do Google
                                Analytics e Meta Pixel.
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Você pode aceitar ou rejeitar esses cookies. Saiba mais em nossa{" "}
                                <Link
                                    href="/privacidade"
                                    className="font-semibold text-[#b88900] hover:underline"
                                >
                                    Política de privacidade
                                </Link>
                                .
                            </p>

                            {preferencesOpen && consent !== null && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Preferência atual:{" "}
                                    <strong>
                                        {consent === "accepted"
                                            ? "cookies opcionais aceitos"
                                            : "cookies opcionais rejeitados"}
                                    </strong>
                                    .
                                </p>
                            )}
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                            {preferencesOpen && consent !== null && (
                                <button
                                    type="button"
                                    onClick={() => setPreferencesOpen(false)}
                                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={rejectCookies}
                                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                Rejeitar não essenciais
                            </button>

                            <button
                                type="button"
                                onClick={acceptCookies}
                                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                Aceitar todos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function TrackingScripts() {
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    return (
        <>
            {googleAnalyticsId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
                        strategy="afterInteractive"
                    />

                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];

                                function gtag(){
                                    dataLayer.push(arguments);
                                }

                                gtag('js', new Date());
                                gtag('config', '${googleAnalyticsId}');
                            `,
                        }}
                    />
                </>
            )}

            {metaPixelId && (
                <Script
                    id="meta-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {
                                if(f.fbq)return;

                                n=f.fbq=function(){
                                    n.callMethod
                                        ? n.callMethod.apply(n, arguments)
                                        : n.queue.push(arguments)
                                };

                                if(!f._fbq)f._fbq=n;

                                n.push=n;
                                n.loaded=!0;
                                n.version='2.0';
                                n.queue=[];

                                t=b.createElement(e);
                                t.async=!0;
                                t.src=v;

                                s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)
                            }(
                                window,
                                document,
                                'script',
                                'https://connect.facebook.net/en_US/fbevents.js'    
                            );

                            fbq('init', '${metaPixelId}');
                            fbq('track', 'PageView');
                        `,
                    }}
                />
            )}
        </>
    );
}