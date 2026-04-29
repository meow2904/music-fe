"use client"
import { ChevronDown } from "lucide-react";
import { RoomCard } from "./room-card";
import { useState, useEffect, useRef, useCallback } from "react";

export function RoomGrid() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastRoomElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/room?page=${page}&limit=12`);
                const json = await res.json();
                if (json.data && json.data.length > 0) {
                    const mappedRooms = json.data.map((room: any) => ({
                        id: room.id,
                        roomName: room.name,
                        isStreaming: room.is_playing,
                        listenerCount: room.member_count,
                        songCount: 0, // Mock for now
                        slug: room.slug,
                    }));

                    // Filter duplicates in case StrictMode double-invokes or concurrent renders
                    setRooms(prev => {
                        const newRooms = [...prev];
                        mappedRooms.forEach((mr: any) => {
                            if (!newRooms.some(r => r.id === mr.id)) {
                                newRooms.push(mr);
                            }
                        });
                        return newRooms;
                    });

                    if (json.data.length < 12) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phòng:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [page]);

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, index) => {
                    if (rooms.length === index + 1) {
                        return (
                            <div ref={lastRoomElementRef} key={room.id} className="h-full">
                                <RoomCard {...room} />
                            </div>
                        );
                    } else {
                        return <RoomCard key={room.id} {...room} />;
                    }
                })}
            </div>

            {isLoading && (
                <div className="flex justify-center mt-8 mb-8">
                    <div className="text-zinc-500 flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tải thêm...
                    </div>
                </div>
            )}

            {!hasMore && rooms.length > 0 && (
                <div className="flex justify-center mt-8 mb-8">
                    <p className="text-zinc-400 text-sm">Bạn đã xem hết danh sách phòng</p>
                </div>
            )}
        </div>
    );
}