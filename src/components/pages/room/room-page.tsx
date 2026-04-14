"use client"
import { Music, Search, Zap, Clock, Plus } from "lucide-react";
import { RoomGrid } from "./room-grid";
import { CreateRoomModal } from "./create-zoom";

const mockRoomsData = [
    { id: 1, roomName: 'Học bài cùng mình - Lofi Study', isStreaming: true, listenerCount: 15, songCount: 42, tags: ['Focus'] },
    { id: 2, roomName: 'Cafe Sáng Đà Lạt', isStreaming: true, listenerCount: 8, songCount: 20, tags: ['Chill'] },
    { id: 3, roomName: 'K-Pop Greatest Hits 2024', isStreaming: true, listenerCount: 120, songCount: 150, tags: ['Popular', 'K-Pop'] },
    { id: 4, roomName: 'K-Pop Greatest Hits 2024', isStreaming: true, listenerCount: 120, songCount: 150, tags: ['Popular', 'K-Pop'] },
    { id: 5, roomName: 'K-Pop Greatest Hits 2024', isStreaming: true, listenerCount: 120, songCount: 150, tags: ['Popular', 'K-Pop'] },
    { id: 6, roomName: 'K-Pop Greatest Hits 2024', isStreaming: true, listenerCount: 120, songCount: 150, tags: ['Popular', 'K-Pop'] },
    { id: 7, roomName: 'K-Pop Greatest Hits 2024', isStreaming: true, listenerCount: 120, songCount: 150, tags: ['Popular', 'K-Pop'] },
    { id: 8, roomName: 'K-Pop Greatest Hits 2024', isStreaming: true, listenerCount: 120, songCount: 150, tags: ['Popular', 'K-Pop'] },
];

export default function RoomPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-zinc-900">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="py-6 border-b border-zinc-100">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div>
                            <h1 className="flex items-center gap-3 text-3xl font-extrabold text-zinc-950 tracking-tight">
                                <span className="relative flex h-3 w-3">
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                Chill Zone
                                <Music className="text-emerald-500" />
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            <div className="relative w-[260px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Tên phòng, thể loại..."
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 outline-none transition"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-100 hover:bg-emerald-100 transition">
                                    <Zap className="w-4 h-4" />
                                    Nổi bật
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-zinc-700 font-medium text-sm hover:bg-zinc-100 transition">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    Mới nhất
                                </button>
                                <CreateRoomModal />
                            </div>
                        </div>
                    </div>
                </div>
                <RoomGrid rooms={mockRoomsData} />
            </div>
        </div>
    );
}