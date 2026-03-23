"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Compass, Radio, LibraryBig, ListMusic, Heart, Users } from "lucide-react";
import { cn } from "@/utils/cn";

const menuItems = [
    {
        group: "MENU", items: [
            { name: "Explore", href: "/", icon: Compass },
            { name: "Radio", href: "/radio", icon: Radio },
        ]
    },
    {
        group: "LIBRARY", items: [
            { name: "Library", href: "/library", icon: LibraryBig },
            { name: "Playlists", href: "/playlists", icon: ListMusic },
            { name: "Liked", href: "/liked", icon: Heart },
        ]
    },
    {
        group: "PEOPLE", items: [
            { name: "Find Friends", href: "/friends", icon: Users },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <aside className="w-64 h-full border-r border-zinc-100 bg-white p-6 flex flex-col space-y-10 
                      dark:bg-zinc-950 dark:border-zinc-800 transition-colors" suppressHydrationWarning>
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600" />
                <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">Sonic Pulse</h1>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 space-y-9">
                {menuItems.map((group) => (
                    <div key={group.group} className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
                            {group.group}
                        </h2>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                // Only calculate active state after mounting to strictly prevent hydration mismatches
                                const isActive = mounted ? pathname === item.href : false;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        suppressHydrationWarning
                                        className={cn(
                                            "flex items-center gap-3.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                                            isActive
                                                ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                                                : "text-zinc-600 hover:bg-zinc-50 hover:text-purple-600 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-purple-400"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "size-5",
                                            isActive ? "text-purple-600 dark:text-purple-400" : "text-zinc-400 dark:text-zinc-600 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                                        )} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}