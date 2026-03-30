import { useRef } from "react";
import { Plus, Play, Heart, MoreVertical, BarChart2 } from "lucide-react";
import { TRACKS } from "@/data/playlist";
import { cn } from "@/utils/cn";

interface PlaylistMobileViewProps {
    playlists: any[];
    activeId: string;
    onSelect: (id: string) => void;
    activePlaylist: any;
}

export function PlaylistMobileView({ playlists, activeId, onSelect, activePlaylist }: PlaylistMobileViewProps) {
    const currentPlayingId = 't2';
    const scrollRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
        const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
        // Nếu đang scroll ngang thì chặn scroll dọc của parent
        if (dx > dy) {
            e.stopPropagation();
        }
    };

    return (
        <div className="flex flex-col gap-3 bg-background min-h-full overflow-x-hidden">
            {/* ===== SECTION 1: Playlist Collection Grid ===== */}
            <div className="px-4 pb-6 ">
                {/* Playlist card grid */}
                <div
                    ref={scrollRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    className="flex w-full overflow-x-auto overscroll-x-contain gap-3 pb-2" // Thêm w-full và overscroll-x-contain
                    style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {playlists.map((pl) => (
                        <div
                            key={pl.id}
                            onClick={() => onSelect(pl.id)}
                            className={cn(
                                "relative w-28 h-28 rounded-2xl overflow-hidden cursor-pointer group transition-all shrink-0", // Thêm w-28 h-28 (112px)
                                activeId === pl.id
                                    ? "ring-2 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                    : ""
                            )}
                        >
                            <img
                                src={pl.cover}
                                alt={pl.name}
                                className="w-full h-full object-cover" // Sửa thành w-full h-full
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Play icon on active */}
                            {activeId === pl.id && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/90 flex items-center justify-center shadow-lg">
                                        <Play fill="white" size={20} className="translate-x-0.5" />
                                    </div>
                                </div>
                            )}

                            {/* Text info at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white font-bold text-sm leading-tight truncate">{pl.name}</p>
                                <p className="text-white/60 text-[11px] mt-0.5">{pl.tracks} tracks</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== SECTION 2: Active Playlist Detail ===== */}
            <div className="flex-1 px-4 pt-4 ">
                {/* Playlist Title + action row */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-foreground">{activePlaylist.name}</h2>
                    <div className="flex items-center gap-3 text-zinc-400">
                        <button className="hover:text-foreground transition">
                            {/* shuffle icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                                <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
                            </svg>
                        </button>
                        <button className="hover:text-foreground transition">
                            {/* repeat icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Track list */}
                <div className="flex flex-col gap-1">
                    {TRACKS.map((track) => {
                        const isPlaying = currentPlayingId === track.id;
                        return (
                            <div
                                key={track.id}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition relative",
                                    isPlaying ? "bg-card" : "hover:bg-card/50"
                                )}
                            >
                                {/* Active left pill */}
                                {isPlaying && (
                                    <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-purple-500 rounded-full" />
                                )}

                                {/* Cover */}
                                <img
                                    src={track.cover || "/sun.jpg"}
                                    className="w-12 h-12 rounded-xl object-cover bg-zinc-800 shrink-0"
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-semibold truncate",
                                        isPlaying ? "text-purple-500 dark:text-purple-400" : "text-foreground"
                                    )}>
                                        {track.title}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{track.artist}</p>
                                </div>

                                {/* Playing indicator OR heart + more */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {isPlaying ? (
                                        <BarChart2 size={18} className="text-purple-500 dark:text-purple-400" />
                                    ) : (
                                        <Heart size={16} className="text-zinc-400 hover:text-purple-400 transition cursor-pointer" />
                                    )}
                                    <MoreVertical size={16} className="text-zinc-400 cursor-pointer" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
