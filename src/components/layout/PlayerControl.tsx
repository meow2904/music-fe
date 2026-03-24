"use client";

import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, MessageSquare, Volume2, ListMusic, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { usePlayerStore } from "@/store/usePlayerStore";

// Component Slider tái sử dụng
function Slider({ value, max, onChange, className }: { value: number; max: number; onChange?: (val: number) => void; className?: string }) {
    return (
        <div className={cn("relative h-1.5 w-full bg-zinc-200 rounded-full dark:bg-zinc-800 group", className)}>
            <div
                style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
                className="absolute top-0 left-0 h-full bg-[#7000FF] rounded-full transition-all duration-100 ease-linear pointer-events-none"
            />
            {onChange && (
                <input
                    type="range"
                    min={0}
                    max={max || 100}
                    value={value || 0}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0"
                />
            )}
        </div>
    );
}

export function PlayerControl() {
    const { currentTrack, isPlaying, volume, duration, currentTime, setPlaying, setVolume, setProgress } = usePlayerStore();

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn(
            "fixed z-50 transition-all duration-300 flex items-center justify-between",
            "bottom-14 left-2 right-2 h-14 bg-white dark:bg-zinc-900 rounded-xl px-4 shadow-xl border border-zinc-100 dark:border-zinc-800",
            "md:bottom-0 md:left-0 md:right-0 md:h-[90px] md:rounded-none md:border-x-0 md:border-b-0 md:px-8 md:shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:md:shadow-none"
        )}>

            <div className="flex items-center gap-3 md:gap-4 md:w-[30%] md:min-w-[250px]">
                <img
                    src={currentTrack?.thumbnail || "/sun.jpg"}
                    alt="Album art"
                    className="rounded-md md:rounded-[14px] w-10 h-10 md:w-14 md:h-14 object-cover shadow-sm"
                />
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{currentTrack?.title || "No Title"}</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{currentTrack?.artist || "Unknown Artist"}</p>
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
                        onClick={() => setPlaying(!isPlaying)}
                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-[#7000FF] text-white rounded-full hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(112,0,255,0.4)]"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>

                    <button className="text-zinc-600 dark:text-zinc-400 hover:text-[#7000FF] transition"><SkipForward size={20} fill="currentColor" /></button>
                    <button className="text-zinc-400 hover:text-[#7000FF] transition"><Repeat size={18} /></button>
                </div>

                <div className="flex items-center gap-3 w-full text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                    <span className="w-8 text-right">{formatTime(currentTime)}</span>
                    <Slider 
                        value={currentTime} 
                        max={duration} 
                        onChange={(val) => {
                            setProgress(val, duration); // Cập nhật hình ảnh thanh UI ngay lập tức
                            usePlayerStore.getState().setSeekTo(val); // Báo cho Youtube Player tua nhạc
                        }}
                        className="h-1.5" 
                    />
                    <span className="w-8">{formatTime(duration)}</span>
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

                <div className="flex items-center gap-2 w-28 border-l border-zinc-200 dark:border-zinc-800 pl-6 shrink-0">
                    <Volume2 size={18} className="text-zinc-500" />
                    <Slider value={volume} max={100} onChange={setVolume} className="h-1" />
                </div>
            </div>

            <div className="flex items-center gap-4 md:hidden">
                <Heart size={20} className="text-[#7000FF]" fill="currentColor" />
                <button
                    onClick={() => setPlaying(!isPlaying)}
                    className="w-9 h-9 flex items-center justify-center bg-[#7000FF] text-white rounded-full shadow-lg shadow-purple-500/30"
                >
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                </button>
            </div>

        </div>
    );
}