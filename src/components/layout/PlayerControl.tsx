"use client";

import { useState } from "react";
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, MessageSquare, Volume2, ListMusic, Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { usePlayerStore } from "@/store/usePlayerStore";

// Component Slider tái sử dụng
function Slider({ value, max, onChange, className, onDragStart, onDragEnd }: { value: number; max: number; onChange?: (val: number) => void; className?: string; onDragStart?: () => void; onDragEnd?: () => void; }) {
    return (
        <div className={cn("relative h-1.5 w-full bg-zinc-200 rounded-full group", className)}>
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
                    onPointerDown={onDragStart}
                    onPointerUp={onDragEnd}
                    onPointerCancel={onDragEnd}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0"
                />
            )}
        </div>
    );
}

export function PlayerControl() {
    const { currentTrack, isPlaying, volume, duration, currentTime, setPlaying, setVolume, setProgress, isLooping, toggleLoop, isShuffled, toggleShuffle, nextTrack, prevTrack, setZoom, isZoomed, activeZoomTab, setActiveZoomTab } = usePlayerStore();
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn(
            "fixed z-110 transition-all duration-300 flex items-center justify-between",
            "bottom-14 h-14 rounded-xl px-4 shadow-xl border bg-white/90 backdrop-blur-2xl border-zinc-200 text-zinc-900",
            "md:bottom-0 md:h-[90px] md:rounded-none md:border-x-0 md:border-b-0 md:px-8",
            isZoomed
                ? "left-[320px] right-[350px]"
                : "left-2 right-2 md:left-0 md:right-0 md:shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
        )}>
            {
                !isZoomed && (
                    <div
                        className={cn(
                            "flex items-center gap-3 md:gap-4 flex-1 justify-start p-2 rounded-xl transition-colors min-w-0",
                            !isZoomed && "cursor-pointer"
                        )}
                        onClick={() => setZoom(true)}
                    >
                        <img
                            src={currentTrack?.thumbnail || "/sun.jpg"}
                            alt="Album art"
                            className="rounded-md md:rounded-[14px] w-10 h-10 md:w-14 md:h-14 object-cover shadow-sm"
                        />
                        <div className="flex flex-col">
                            <h3 className={cn("text-sm font-bold line-clamp-1 text-zinc-900")}>{currentTrack?.title || "No Title"}</h3>
                            <p className={cn("text-[10px] md:text-xs line-clamp-1 text-zinc-500")}>{currentTrack?.artist || "Unknown Artist"}</p>
                        </div>
                        <button className="hidden md:block ml-4 text-[#7000FF] hover:scale-110 transition-transform">
                            <Heart size={18} fill="currentColor" />
                        </button>
                    </div>
                )
            }
            <div className="hidden md:flex flex-col items-center justify-center gap-2 max-w-2xl shrink-0 px-4">
                <div className="flex items-center gap-6">
                    <button onClick={toggleShuffle} title="Trộn danh sách phát" className={cn("transition hover:scale-105 hover:cursor-pointer", isShuffled ? "text-[#7000FF]" : "text-zinc-400 hover:text-[#7000FF]")}><Shuffle size={18} /></button>
                    <button onClick={prevTrack} className={cn("transition hover:scale-105 hover:cursor-pointer", "text-zinc-600 hover:text-[#7000FF]")}><SkipBack size={20} fill="currentColor" /></button>

                    <button
                        onClick={() => setPlaying(!isPlaying)}
                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-[#7000FF] text-white rounded-full hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(112,0,255,0.4)] hover:cursor-pointer"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>

                    <button onClick={nextTrack} className={cn("transition hover:scale-105 hover:cursor-pointer", "text-zinc-600 hover:text-[#7000FF]")}><SkipForward size={20} fill="currentColor" /></button>
                    <button onClick={toggleLoop} title={isLooping ? "Tắt lặp" : "Bật lặp"} className={cn("transition hover:scale-105 hover:cursor-pointer", isLooping ? "text-[#7000FF]" : "text-zinc-400 hover:text-[#7000FF]")}><Repeat size={18} /></button>
                </div>

                <div className="flex items-center gap-3 w-full text-[10px] font-bold text-zinc-500 tabular-nums">
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

            <div className="hidden md:flex flex-1 justify-end items-center gap-4 lg:gap-6 min-w-0">
                <div className="flex items-center gap-2 w-48 md:w-48 pl-6 shrink-0 relative">
                    <Volume2 size={18} className="text-zinc-500" />
                    <div className="relative w-full flex items-center">
                        <Slider
                            value={volume}
                            max={100}
                            onChange={setVolume}
                            onDragStart={() => setIsDraggingVolume(true)}
                            onDragEnd={() => setIsDraggingVolume(false)}
                            className="h-1"
                        />
                        {/* Popup hiển thị % volume */}
                        <div
                            className={cn(
                                "absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none transition-all duration-200",
                                isDraggingVolume ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
                            )}
                        >
                            {Math.round(volume)}%
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-5 border-l border-zinc-200 pl-6">
                    <button
                        onClick={() => { setActiveZoomTab('playlist'); setZoom(true); }}
                        className={cn("flex flex-col items-center gap-1 transition hover:cursor-pointer", activeZoomTab === 'playlist' ? "text-[#7000FF]" : "text-zinc-400 hover:text-[#7000FF]")}
                    >
                        <ListMusic size={18} />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Playlists</span>
                    </button>
                    <button
                        onClick={() => { setActiveZoomTab('chat'); setZoom(true); }}
                        className={cn("flex flex-col items-center gap-1 transition hover:cursor-pointer", activeZoomTab === 'chat' ? "text-[#7000FF]" : "text-zinc-400 hover:text-[#7000FF]")}
                    >
                        <MessageSquare size={18} fill={activeZoomTab === 'chat' ? "currentColor" : "none"} />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Chat</span>
                    </button>
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