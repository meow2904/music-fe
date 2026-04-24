import { Play, Pen, Share2, Heart, BarChart2, Filter, LayoutGrid, Clock, User } from "lucide-react";
import { TRACKS } from "@/data/playlist";
import { cn } from "@/utils/cn";

export function PlaylistDetail({ playlist }: { playlist: any }) {
    // Giả sử bài số 2 đang được phát
    const currentPlayingId = 't2';

    return (
        <div className="px-4 md:px-8 space-y-8 pb-32 pt-6 bg-card min-h-full transition-colors overflow-x-hidden">
            {/* 1. Header Playlist */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-44 h-44 md:w-56 md:h-56 rounded-2xl shadow-xl object-cover bg-zinc-800 shrink-0"
                />
                <div className="flex flex-col gap-2 md:gap-3 pb-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                        <button className="bg-[#c084fc] hover:bg-[#d8b4fe] text-black px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold flex items-center gap-2 transition shadow-lg shrink-0">
                            <Play fill="currentColor" size={18} /> PLAY ALL
                        </button>
                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-foreground leading-tight">{playlist.name}</h1>
                        <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-zinc-200 hover:bg-background/50 transition text-foreground/70">
                            <Pen size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Tracklist */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">Tracklist</h2>
                </div>

                {/* Danh sách bài hát */}
                <div className="flex flex-col gap-1">
                    {TRACKS.map((track, index) => {
                        const isPlaying = currentPlayingId === track.id;

                        return (
                            <div
                                key={track.id}
                                className={cn(
                                    "grid grid-cols-[30px_1fr_60px] sm:grid-cols-[40px_1.5fr_1fr_80px] lg:grid-cols-[40px_2fr_1.2fr_0.8fr_80px] gap-2 md:gap-4 px-4 md:px-6 py-3 rounded-xl items-center group transition relative",
                                    isPlaying ? "bg-background shadow-sm" : "hover:bg-background/30"
                                )}
                            >
                                {/* Active Left Border */}
                                {isPlaying && (
                                    <div className="absolute left-0 top-2 bottom-2 w-[3px] md:w-[4px] bg-[#c084fc] rounded-full"></div>
                                )}
                                {/* Tên & Ảnh bài hát */}
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    <img src={track.cover || "/sun.jpg"} className="w-10 h-10 md:w-11 md:h-11 rounded-md bg-zinc-800 flex-shrink-0 shadow-sm" />
                                    <div className="flex flex-col truncate min-w-0">
                                        <span className={cn(
                                            "text-sm md:text-[15px] font-semibold truncate",
                                            isPlaying ? "text-purple-600]" : "text-foreground"
                                        )}>
                                            {track.title}
                                        </span>
                                        <span className="text-[11px] md:text-xs text-zinc-400 truncate mt-0.5">{track.artist}</span>
                                    </div>
                                </div>

                                <div className="text-xs md:text-sm font-medium text-zinc-400 truncate hidden sm:block">{track.album}</div>
                                <div className="text-xs md:text-sm font-medium text-zinc-400 truncate hidden lg:block">{track.date}</div>

                                {/* Trái tim & Thời gian */}
                                <div className="flex items-center justify-end gap-2 md:gap-3 text-xs md:text-sm font-medium text-zinc-400">
                                    <Heart size={14} className={cn(
                                        "cursor-pointer opacity-0 group-hover:opacity-100 transition hidden md:block",
                                        isPlaying && "opacity-100 text-purple-600]",
                                        "hover:text-foreground"
                                    )} fill={isPlaying ? "currentColor" : "none"} />
                                    <span className="min-w-[40px] text-right">{track.time}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Related Playlists placeholder */}
            <div className="pt-2">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Related Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                    <div className="aspect-4/3 bg-background/50 rounded-2xl border border-zinc-200 hover:bg-background transition cursor-pointer shadow-sm"></div>
                    <div className="aspect-4/3 bg-background/50 rounded-2xl border border-zinc-200 hover:bg-background transition cursor-pointer shadow-sm"></div>
                    <div className="aspect-4/3 bg-background/50 rounded-2xl border border-zinc-200 hover:bg-background transition cursor-pointer shadow-sm"></div>
                </div>
            </div>
        </div>
    );
}