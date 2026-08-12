import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-6"
        >
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                {items.map((item, index) => {
                    const ultimo = index === items.length - 1;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className="flex items-center gap-1.5 min-w-0"
                        >
                            {index > 0&& (
                                <ChevronRight
                                    size={14}
                                    strokeWidth={1.8}
                                    className="shrink-0 text-gray-300"
                                    aria-hidden="true"
                                />
                            )}

                            {ultimo || !item.href ? (
                                <span
                                    aria-current={ultimo ? "page" : undefined}
                                    className={`
                                        truncate
                                        ${
                                            ultimo
                                                ? "font-semibold text-black"
                                                : ""
                                        }    
                                    `}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="
                                        transition-colors
                                        hover:text-[#D9A300]
                                        focus-visible:outline-none
                                        focus-visible:text-[#D9A300]
                                    "
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    )
}