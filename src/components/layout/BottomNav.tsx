"use client";

import { Home, Activity, Library, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Flow", href: "/flow", icon: Activity },
    { name: "Library", href: "/library", icon: Library },
    { name: "Social", href: "/social", icon: MessageCircle },
];

export function BottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-12 bg-[#0A0A0A]/90 backdrop-blur-lg border-t border-zinc-800 flex items-center justify-around z-50 px-2 pb-safe" suppressHydrationWarning>
            {navItems.map((item) => {
                const isActive = mounted ? pathname === item.href : false;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        suppressHydrationWarning
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                            isActive ? "text-[#B066FF]" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Icon size={20} className={isActive ? "fill-current opacity-20" : ""} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}