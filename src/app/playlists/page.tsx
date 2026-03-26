"use client";
import { useState } from "react";
import { SidebarPlaylists } from "@/components/pages/playlist/sidebar-playlist";
import { PlaylistDetail } from "@/components/pages/playlist/playlist-detail";
import { PlaylistMobileView } from "@/components/pages/playlist/playlist-mobile-view";
import { PLAYLISTS } from "@/data/playlist";

export default function PlaylistPage() {
    const [activePlaylistId, setActivePlaylistId] = useState(PLAYLISTS[0].id);
    const activePlaylist = PLAYLISTS.find(p => p.id === activePlaylistId) || PLAYLISTS[0];

    return (
        <div className="flex h-full bg-background text-foreground transition-colors">
            {/* MOBILE layout: full-width single-column */}
            <div className="flex flex-col w-full sm:hidden overflow-y-auto pb-32">
                <PlaylistMobileView
                    playlists={PLAYLISTS}
                    activeId={activePlaylistId}
                    onSelect={setActivePlaylistId}
                    activePlaylist={activePlaylist}
                />
            </div>

            {/* DESKTOP layout: sidebar + detail */}
            <div className="hidden sm:flex w-full h-full">
                {/* Cột trái: Danh sách Playlist */}
                <div className="w-[280px] flex flex-col shrink-0 relative z-10">
                    <SidebarPlaylists
                        activeId={activePlaylistId}
                        onSelect={setActivePlaylistId}
                    />
                </div>

                {/* Cột phải: Chi tiết Playlist */}
                <div className="flex-1 overflow-y-auto">
                    <PlaylistDetail playlist={activePlaylist} />
                </div>
            </div>
        </div>
    );
}