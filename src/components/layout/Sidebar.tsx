"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, UserPlus, Menu, Music2, Globe2, Radio } from "lucide-react";
import { cn } from "@/utils/cn";

const menuItems = [
    {
        group: "LIBRARY",
        items: [
            { name: "Playlists", href: "/playlists", icon: Music2 },
            { name: "Liked Songs", href: "/liked", icon: Heart },
        ]
    },
    {
        group: "ROOMS",
        items: [
            { name: "My Music Room", href: "/myroom", icon: Radio },
            { name: "Online Rooms", href: "/online", icon: Globe2 },
        ]
    },
    {
        group: "PEOPLE",
        items: [
            { name: "Find Friends", href: "/friends", icon: UserPlus },
        ]
    }
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn(
            "hidden sm:flex h-full bg-white dark:bg-zinc-950 flex-col transition-all duration-300 z-50 fixed top-0 left-0",
            isCollapsed ? "w-[80px]" : "w-[240px] shadow-2xl bg-white",
        )}>
            {/* Logo Section - OVERFLOWS THE ASIDE DIV WHEN COLLAPSED SO IT STAYS EXACTLY AS BEFORE */}
            <div className={cn(
                "flex items-center gap-3 px-4 shrink-0 h-[64px] md:h-[80px] border-b border-zinc-100 dark:border-zinc-800 absolute top-0 left-0 bg-white dark:bg-zinc-950 z-50 overflow-hidden transition-all duration-300",
            )}>
                <Menu size={20}
                    className="text-zinc-500 rounded-lg hidden sm:block cursor-pointer hover:text-purple-600 transition-colors shrink-0"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500 truncate tracking-tight pl-1">
                    Sonic
                </span>
            </div>

            {/* Scrollable Navigation - HAS RIGHT BORDER */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar border-r border-zinc-100 dark:border-zinc-800 pb-32 md:pb-28 pt-[64px] md:pt-[80px]">
                <nav className="flex-1 w-full space-y-8 no-scrollbar">
                    {menuItems.map((group) => (
                        <div key={group.group} className="space-y-2">
                            {!isCollapsed && (
                                <h2 className="px-3 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                                    {group.group}
                                </h2>
                            )}
                            <div className={cn("space-y-1", isCollapsed && "flex flex-col items-center w-full")}>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            title={isCollapsed ? item.name : ""}
                                            className={cn(
                                                "flex items-center rounded-xl transition-all duration-200 group relative",
                                                isCollapsed ? "justify-center h-12 w-12" : "px-3 py-3 gap-4 mx-2",
                                                isActive
                                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none"
                                                    : "text-zinc-500 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-zinc-900"
                                            )}
                                        >
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                                            {!isCollapsed && <span className="text-sm font-semibold truncate">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className={cn("mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4", isCollapsed ? "items-center px-0" : "px-4")}>
                    <button className={cn(
                        "flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-purple-600 transition-colors",
                        isCollapsed ? "w-10 h-10" : "w-full py-2.5 gap-2"
                    )}>
                        <UserPlus size={18} />
                        {!isCollapsed && <span className="text-sm font-medium">Add Account</span>}
                    </button>

                    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 shrink-0">
                            <img
                                src="https://i.pravatar.cc/150?u=sonic"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">Lona K.</p>
                                <p className="text-xs text-zinc-500 truncate">Premium User</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </aside>
    );
}