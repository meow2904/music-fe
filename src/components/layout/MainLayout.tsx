"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { PlayerControl } from "./PlayerControl";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { cn } from "@/utils/cn";
import { AudioEngine } from "../ui/AudioEngine";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsCollapsed(false);
            } else {
                setIsCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Khởi tạo bài hát mặc định nếu chưa có, nhưng không tự động phát
        if (!usePlayerStore.getState().currentTrack) {
            usePlayerStore.getState().setCurrentTrack(
                {
                    id: '1nfwAOyCgmc',
                    title: 'LONA - Trêm Hoa',
                    artist: 'Lona K.',
                    thumbnail: '/sun.jpg',
                },
                false
            );
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex h-dvh w-full overflow-hidden relative bg-background text-foreground transition-colors duration-300">
            {/* 1. SIDEBAR on the left */}
            <div className={cn(
                "hidden sm:block z-40 shrink-0 transition-all duration-300",
                isCollapsed ? "w-[80px]" : "w-[240px]"
            )}>
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            {/* 2. BODY CONTENT: Navbar + Main Content on the right */}
            <div className="flex flex-col flex-1 min-w-0 w-full relative">

                {/* Navbar */}
                <Navbar isCollapsed={isCollapsed} />

                {/* KHU VỰC NỘI DUNG CHÍNH */}
                <main className="flex-1 overflow-y-auto pb-40 md:pb-28 p-4 md:p-8 lg:p-10 z-0">
                    {children}
                </main>

            </div>

            {/* 3. PLAYER CONTROL */}
            <PlayerControl />

            {/* 4. BOTTOM NAV */}
            <div className="block md:hidden z-50">
                <BottomNav />
            </div>
            <AudioEngine />
        </div>
    );
}