"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Compass, Radio, LibraryBig, ListMusic, Heart, Users, UserPlus, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
    // Mặc định mobile sẽ là collapsed (chỉ hiện icon/logo)
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setMounted(true);
        // Tự động mở rộng trên màn hình lớn (Desktop)
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsCollapsed(false);
            } else {
                setIsCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Mobile (dưới md): Chỉ render Logo nội tuyến chung với Navbar, ẩn mọi thứ khác */}
            <div className="flex items-center gap-3 md:hidden">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold">
                    S
                </div>
                {!isCollapsed && (
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500 max-sm:hidden">
                        Sonic Pulse
                    </span>
                )}
            </div>

            {/* Tablet/Desktop (từ md trở lên): Render Sidebar đầy đủ trôi nổi cạnh trái. 
                Kèm khối Ghost Div giữ chỗ để không che content */}
            <div className={cn("hidden md:block transition-all duration-300 shrink-0", isCollapsed ? "w-20" : "w-64")} />

            <aside
                className={cn(
                    "hidden md:flex fixed left-0 top-0 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 transition-all duration-300 z-50 flex-col py-6 shadow-2xl lg:shadow-none",
                    isCollapsed ? "w-20 items-center" : "w-64 px-4"
                )}
            >
                {/* Nút Menu Collapse thần thánh nổi ngay mép Sidebar */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-7 -right-3.5 w-7 h-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 hover:text-purple-600 transition-transform shadow-sm hover:scale-110 z-50"
                >
                    {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
                </button>

                {/* Logo Section */}
                <div className={cn("mb-10 flex items-center shrink-0", isCollapsed ? "justify-center" : "gap-3 px-2")}>
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold">
                        S
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500 truncate tracking-tight">
                            Sonic Pulse
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 w-full space-y-8 overflow-y-auto no-scrollbar">
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
                                                isCollapsed ? "justify-center h-12 w-12" : "px-3 py-3 gap-4",
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

                {/* User Profile Section (Dưới cùng ảnh) */}
                <div className={cn("mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4", isCollapsed ? "items-center px-0" : "px-2")}>
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
            </aside>
        </>
    );
}