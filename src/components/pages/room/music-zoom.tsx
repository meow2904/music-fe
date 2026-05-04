"use client"

import { useState, useRef, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { Music, Share2, Heart, SkipBack, Pause, Play, SkipForward, Volume2, MoreHorizontal, Send, ChevronDown, Repeat, Shuffle } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { cn } from "@/utils/cn";
import { AudioEngine } from "@/components/ui/AudioEngine";

export default function MusicZoom() {

    const {
        isZoomed, setZoom,
        currentTrack, queue,
        isPlaying, setPlaying,
        nextTrack, prevTrack,
        volume, setVolume,
        duration, currentTime, setProgress, setSeekTo,
        activeZoomTab
    } = usePlayerStore();

    // Xử lý vuốt/cuộn xuống để thu nhỏ (minimize)
    const touchStartY = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        // Nếu vuốt xuống hơn 50px thì đóng
        if (touchEndY - touchStartY.current > 50) {
            setZoom(false);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        // Chỉ xử lý đóng khi scroll trên container chính, không áp dụng cho các vùng có thanh cuộn (như danh sách chờ/chat)
        if (e.deltaY > 50) {
            // setZoom(false); // Tuỳ chọn: nếu muốn wheel chuột để đóng thì uncomment
        }
    };

    const displayQueue = currentTrack ? [currentTrack, ...queue] : queue;
    const mockMembers = [
        { id: 'm1', name: 'Huy', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 'm2', name: 'Linh', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: 'm3', name: 'Thanh', avatar: 'https://i.pravatar.cc/150?u=3' },
        { id: 'm4', name: 'Vy', avatar: 'https://i.pravatar.cc/150?u=4' },
        { id: 'm5', name: 'Minh', avatar: 'https://i.pravatar.cc/150?u=5' },
        { id: 'm6', name: 'Tùng', avatar: 'https://i.pravatar.cc/150?u=6' },
    ];
    const mockChats = [
        { id: 'c1', user: 'Huy', text: 'Bài này hay nè mọi người!', time: '10:30 AM' },
        { id: 'c2', user: 'Linh', text: 'Đúng gu tôi luônnnn 🔥', time: '10:32 AM' },
        { id: 'c3', user: 'An', text: 'Ú u ú ú ú ú ú ú ú ú ú ú ú ú', time: '10:33 AM' },
        { id: 'c4', user: 'Thủy', text: 'Nhạc này chill thật sự', time: '10:35 AM' },
    ];

    return (
        <div
            className={cn(
                "fixed inset-0 z-100 flex flex-col lg:flex-row h-screen w-full bg-zinc-50 text-zinc-800 overflow-hidden font-sans transition-transform duration-500 ease-in-out",
                isZoomed ? "translate-y-0" : "translate-y-full"
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
        >

            {/* ================= COLUMN 1: LEFT (QUEUE) ================= */}
            <div className={cn(
                "flex-col border-zinc-200 bg-white",
                "lg:flex lg:w-[320px] lg:border-r lg:h-full lg:order-1 lg:pb-[90px]",
                "w-full order-2 flex-1 border-t lg:border-t-0 overflow-hidden pb-14 md:pb-[90px]",
                activeZoomTab === 'playlist' ? "flex" : "hidden lg:flex"
            )}>
                {/* Header Queue */}
                <div className="p-5 border-b border-zinc-200">
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <Music className="w-5 h-5 text-indigo-600" />
                        Danh sách chờ
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">{displayQueue.length} bài hát trong hàng đợi</p>
                </div>

                {/* Danh sách bài hát */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {displayQueue.map((song, index) => (
                        <div
                            key={song.id + index}
                            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${index === 0 ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-zinc-100'}`}
                        >
                            <img src={song.thumbnail || "/sun.jpg"} alt="cover" className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 overflow-hidden">
                                <h4 className={`text-sm font-semibold truncate ${index === 0 ? 'text-indigo-600' : 'text-zinc-800'}`}>
                                    {song.title}
                                </h4>
                                <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* ================= COLUMN 2: CENTER (MAIN PLAYER) ================= */}
            <div className={cn(
                "flex flex-col relative bg-linear-to-b from-indigo-50 to-zinc-50 shrink-0 overflow-hidden",
                "lg:flex-1 lg:h-full lg:order-2 lg:shrink lg:pb-[90px]",
                "w-full h-[50vh] lg:h-auto order-1 pb-4"
            )}>

                {/* Top Bar (Tên phòng) */}
                <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-20">
                    <div className="flex items-center gap-3">
                        <Button
                            isIconOnly
                            className="bg-white/80 backdrop-blur-md shadow-sm border border-zinc-200/50 text-zinc-600 hover:bg-white hover:scale-105 transition-all w-10 h-10 min-w-10"
                            onClick={() => setZoom(false)}
                        >
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight leading-tight">Phòng Chill Cuối Tuần 🎧</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                <p className="text-xs font-medium text-zinc-500">Host bởi <span className="text-indigo-600">Huy Nguyễn</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Visualizer / Video */}
                <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-0 lg:pb-4 pt-20 overflow-hidden">
                    <div className="relative group w-full max-w-6xl aspect-video md:max-h-full">
                        {/* Hiệu ứng Glow mờ phía sau */}
                        <div className="absolute -inset-10 bg-indigo-400/20 blur-3xl rounded-[3rem] opacity-70 animate-pulse pointer-events-none"></div>

                        {/* TV Frame */}
                        <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] p-2 pb-6 md:p-3 md:pb-10 bg-zinc-900 ring-1 ring-zinc-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),0_0_40px_rgba(79,70,229,0.2)] relative z-10 transition-transform duration-500 hover:scale-[1.01]">

                            {/* Inner Screen Bezel */}
                            <div className="w-full h-full rounded-xl md:rounded-2xl bg-black relative border border-black shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
                                {/* Video bài hát đang phát */}
                                <AudioEngine className="w-full h-full bg-black pointer-events-none" />
                            </div>

                            {/* TV Hardware Details (Bottom bar) */}
                            <div className="absolute bottom-1 md:bottom-2 left-0 right-0 flex justify-center items-center gap-6 md:gap-16 pointer-events-none">
                                {/* Left Speaker grille */}
                                <div className="hidden md:flex gap-2 opacity-40">
                                    {[...Array(6)].map((_, i) => <div key={`l-${i}`} className="w-1 h-1 rounded-full bg-zinc-500"></div>)}
                                </div>

                                {/* Branding */}
                                <div className="text-[9px] md:text-xs font-black tracking-[0.4em] text-zinc-400 uppercase drop-shadow-md">
                                    TV
                                </div>

                                {/* Right Speaker & LED Power */}
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="hidden md:flex gap-2 opacity-40">
                                        {[...Array(6)].map((_, i) => <div key={`r-${i}`} className="w-1 h-1 rounded-full bg-zinc-500"></div>)}
                                    </div>
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* ================= COLUMN 3: RIGHT (SOCIAL / CHAT) ================= */}
            <div className={cn(
                "flex-col border-zinc-200 bg-white",
                "lg:flex lg:w-[350px] lg:border-l lg:h-full lg:order-3 lg:pb-[90px]",
                "w-full order-3 flex-1 border-t lg:border-t-0 overflow-hidden pb-14 md:pb-[90px]",
                activeZoomTab === 'chat' ? "flex" : "hidden lg:flex"
            )}>

                {/* Danh sách thành viên */}
                <div className="p-5 border-b border-zinc-200">
                    <h3 className="text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Đang nghe ({mockMembers.length})</h3>
                    {/* <AvatarGroup isBordered max={5} className="justify-start">
                        {mockMembers.map((member) => (
                            <Avatar key={member.id} src={member.avatar} name={member.name} className="border-zinc-900" />
                        ))}
                    </AvatarGroup> */}
                </div>

                {/* Khu vực hiển thị tin nhắn */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {mockChats.map((chat) => (
                        <div key={chat.id} className="flex flex-col">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-sm text-indigo-600">{chat.user}</span>
                                <span className="text-[10px] text-zinc-400">{chat.time}</span>
                            </div>
                            <p className="text-sm text-zinc-700 bg-zinc-100 border border-zinc-200/50 w-fit py-2 px-3 rounded-tr-xl rounded-b-xl">
                                {chat.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Input Chat */}
                <div className="p-4 border-t border-zinc-200">
                    <div className="relative flex items-center">
                        <Input
                            placeholder="Nhắn tin vào phòng..."
                            className="bg-zinc-100 border-zinc-200 hover:border-zinc-300 focus-within:border-indigo-500 text-zinc-800"
                        />
                        <button className="absolute right-3 text-indigo-600 hover:text-indigo-500 focus:outline-none">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}