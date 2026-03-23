"use client";

import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, MessageSquare, Volume2, ListMusic, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";

// Component Slider tái sử dụng
function Slider({ value, max, className }: { value: number; max: number; className?: string }) {
    return (
        <div className={cn("relative h-1.5 w-full bg-zinc-200 rounded-full dark:bg-zinc-800", className)}>
            <div
                style={{ width: `${(value / max) * 100}%` }}
                className="absolute top-0 left-0 h-full bg-[#7000FF] rounded-full"
            />
        </div>
    );
}

export function PlayerControl() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className={cn(
            "fixed z-50 transition-all duration-300 flex items-center justify-between",
            "bottom-18 left-2 right-2 h-14 bg-white dark:bg-zinc-900 rounded-xl px-4 shadow-xl border border-zinc-100 dark:border-zinc-800",
            "md:bottom-0 md:left-0 md:right-0 md:h-[90px] md:rounded-none md:border-x-0 md:border-b-0 md:px-8 md:shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:md:shadow-none"
        )}>

            <div className="flex items-center gap-3 md:gap-4 md:w-[30%] md:min-w-[250px]">
                <Image
                    src="/sun.jpg"
                    alt="Album art"
                    width={48} height={48}
                    className="rounded-md md:rounded-[14px] w-10 h-10 md:w-14 md:h-14 object-cover shadow-sm"
                />
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">Urban Sunset</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400">Deep Vibes</p>
                </div>
                <button className="hidden md:block ml-4 text-[#7000FF] hover:scale-110 transition-transform">
                    <Heart size={18} fill="currentColor" />
                </button>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl flex-col items-center gap-2">
                <div className="flex items-center gap-6">
                    <button className="text-zinc-400 hover:text-[#7000FF] transition"><Shuffle size={18} /></button>
                    <button className="text-zinc-600 dark:text-zinc-400 hover:text-[#7000FF] transition"><SkipBack size={20} fill="currentColor" /></button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-[#7000FF] text-white rounded-full hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(112,0,255,0.4)]"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>

                    <button className="text-zinc-600 dark:text-zinc-400 hover:text-[#7000FF] transition"><SkipForward size={20} fill="currentColor" /></button>
                    <button className="text-zinc-400 hover:text-[#7000FF] transition"><Repeat size={18} /></button>
                </div>

                <div className="flex items-center gap-3 w-full text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                    <span>1:42</span>
                    <Slider value={102} max={234} className="h-1.5" />
                    <span>3:54</span>
                </div>
            </div>

            <div className="hidden md:flex w-[30%] min-w-[250px] justify-end items-center gap-6">

                <div className="flex items-center gap-5">
                    <button className="flex flex-col items-center gap-1 text-[#7000FF]">
                        <MessageSquare size={18} fill="currentColor" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Chat</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-[#7000FF] transition">
                        <ListMusic size={18} />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Lyrics</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 w-28 border-l border-zinc-200 dark:border-zinc-800 pl-6">
                    <Volume2 size={18} className="text-zinc-500" />
                    <Slider value={70} max={100} className="h-1" />
                </div>
            </div>

            <div className="flex items-center gap-4 md:hidden">
                <Heart size={20} className="text-[#7000FF]" fill="currentColor" />
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 flex items-center justify-center bg-[#7000FF] text-white rounded-full shadow-lg shadow-purple-500/30"
                >
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                </button>
            </div>

        </div>
    );
}