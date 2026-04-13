"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { PlayerControl } from "./PlayerControl";
import { BottomNav } from "./BottomNav";
import { AudioEngine } from "../ui/AudioEngine";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex h-dvh w-full overflow-hidden relative bg-background text-foreground transition-colors duration-300">
            <div className="flex flex-col flex-1 min-w-0 w-full relative">
                <Navbar />
                <main className="flex-1 overflow-y-auto pb-40 md:pb-28 p-3 md:p-5 lg:p-10 z-0">
                    {children}
                </main>
            </div>
            <PlayerControl />
            <div className="block md:hidden z-50">
                <BottomNav />
            </div>
            <AudioEngine />
        </div>
    );
}