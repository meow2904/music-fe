import { Plus } from "lucide-react";
import { PLAYLISTS } from "@/data/playlist";
import { cn } from "@/utils/cn";

export function SidebarPlaylists({ activeId, onSelect }: { activeId: string, onSelect: (id: string) => void }) {
    return (
        <div className="flex flex-col gap-6 py-6 bg-background h-full overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-10 relative transition-colors">
            <div className="px-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
            </div>
            <div className="flex flex-col px-4 gap-1">
                {PLAYLISTS.map((playlist) => (
                    <div
                        key={playlist.id}
                        onClick={() => onSelect(playlist.id)}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                            activeId === playlist.id
                                ? "bg-card shadow-[0_4px_20px_rgba(192,132,252,0.15)] dark:shadow-[0_4px_20px_rgba(192,132,252,0.1)]"
                                : "hover:bg-card/50 hover:shadow-sm"
                        )}
                    >
                        <img src={playlist.cover} alt="" className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                        <div className="flex flex-col overflow-hidden">
                            <span className={cn(
                                "text-[15px] font-semibold truncate",
                                activeId === playlist.id ? "text-purple-600 dark:text-purple-300" : "text-foreground"
                            )}>
                                {playlist.name}
                            </span>
                            <span className="text-xs text-zinc-500 mt-0.5">
                                {playlist.tracks} Tracks • {playlist.duration}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}