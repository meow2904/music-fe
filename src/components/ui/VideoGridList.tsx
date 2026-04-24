"use client";

import useSWRInfinite from "swr/infinite";
import { Play, Mic2, Clock3, Loader2, Heart, Plus, Share2 } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

// Hàm fetcher cơ bản cho SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getKey = (pageIndex: number, previousPageData: any, query: string) => {
    if (!query) return null; // Không có query thì không fetch
    if (previousPageData && !previousPageData.items?.length) return null; // Hết dữ liệu

    // Nếu trang > 0 và có nextPageToken
    if (pageIndex > 0 && previousPageData?.nextPageToken) {
        return `/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=12&pageToken=${previousPageData.nextPageToken}`;
    }

    // Trang đầu tiên
    return `/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=12`;
};

export function VideoGridList({ query }: { query: string }) {
    const { currentTrack, isPlaying } = usePlayerStore();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const { data, size, setSize, isValidating, error } = useSWRInfinite(
        (...args) => getKey(...args, query),
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
            revalidateFirstPage: false,
        }
    );

    const tracks = data ? data.flatMap(page => page.items || []) : [];
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined") || isValidating;
    const isReachingEnd = data && (data[data.length - 1]?.items?.length === 0 || !data[data.length - 1]?.nextPageToken);

    // Tự động load tiếp khi cuộn xuống tới target
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isReachingEnd && !isLoadingMore) {
                    setSize(size + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [isReachingEnd, isLoadingMore, setSize, size]);

    // Xử lý khi nhấn vào một bài hát
    const handlePlay = (track: any) => {
        // TODO: Xử lý logic phát nhạc
    };

    // Hiển thị khi chưa search gì
    if (!query) return <p className="text-center py-16 text-zinc-400 text-sm">Nhập từ khóa để tìm kiếm nhạc...</p>;

    // Hiển thị trạng thái Loading ban đầu
    if (isLoadingInitialData) return <SkeletonGrid />;

    // Hiển thị lỗi
    if (error) return <p className="text-center py-10 text-red-500 text-sm">Đã xảy ra lỗi khi tải nhạc. Vui lòng thử lại.</p>;

    // Hiển thị khi không có kết quả
    if (query && data && tracks.length === 0) return <p className="text-center py-10 text-zinc-500 text-sm">Không tìm thấy kết quả cho "{query}".</p>;

    return (
        <div>
            <h1 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
                <Mic2 className="text-purple-600" size={24} />
                Kết quả cho "{query}"
            </h1>

            {/* GRID LAYOUT: 4 cột trên Desktop, 3 trên Tablet, 1 trên Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                {tracks.map((track: any, index: number) => {
                    if (!track) return null;
                    const videoId = track.id?.videoId || track.id;
                    const title = track.snippet?.title;
                    const artist = track.snippet?.channelTitle;
                    const thumbnail = track.snippet?.thumbnails?.high?.url;
                    const isCurrent = currentTrack?.id === videoId;

                    return (
                        <div
                            key={`${videoId}-${index}`} // Đảm bảo key duy nhất khi trang lặp lại search
                            className="group bg-white p-1 rounded-2xl border border-zinc-100  hover:border-purple-200  transition-all shadow-sm hover:shadow-lg"
                            onMouseEnter={() => setHoveredId(videoId)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Thumbnail container */}
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 shadow-md">
                                <img
                                    src={thumbnail}
                                    alt={title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                />

                                {/* Overlay & Play Button khi hover */}
                                <div className={cn(
                                    "absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center",
                                    (hoveredId === videoId || (isCurrent && isPlaying)) ? "opacity-100" : "opacity-0"
                                )}>
                                    <button
                                        onClick={() => handlePlay(track)}
                                        className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-xl"
                                    >
                                        {isCurrent && isPlaying ? (
                                            <div className="flex gap-1 items-end h-5">
                                                <div className="w-1 h-3 bg-white animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1 h-5 bg-white animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1 h-4 bg-white animate-bounce"></div>
                                            </div>
                                        ) : (
                                            <Play size={26} fill="white" className="ml-1" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Track Info */}
                            <div className="flex flex-col gap-1 px-1">
                                <h3 className={cn(
                                    "text-sm font-semibold truncate group-hover:text-purple-600 transition-colors",
                                    isCurrent ? "text-purple-600" : "text-zinc-900"
                                )}>
                                    {title}
                                </h3>
                                <p className="text-xs text-zinc-500 truncate flex items-center gap-1.5">
                                    <Mic2 size={12} className="text-zinc-400 shrink-0" />
                                    {artist}
                                </p>

                                <div className="flex items-center justify-end border-t border-zinc-100">
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 transition-opacity -mr-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); /* TODO: Like logic */ }}
                                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Yêu thích"
                                        >
                                            <Heart size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); /* TODO: Add to Playlist logic */ }}
                                            className="p-1.5 text-zinc-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                            title="Thêm vào danh sách phát"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); /* TODO: Share logic */ }}
                                            className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Chia sẻ"
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Loading / Observer Target - Điểm cuộn chạm đến cuối */}
            <div ref={observerTarget} className="flex justify-center py-6 mt-4 opacity-50">
                {isLoadingMore ? (
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm font-medium">Đang tải thêm...</span>
                    </div>
                ) : isReachingEnd ? (
                    <span className="text-sm text-zinc-500">Đã hiển thị toàn bộ kết quả.</span>
                ) : null}
            </div>
        </div>
    );
}

// Component Skeleton Loading
function SkeletonGrid() {
    return (
        <div className="p-8">
            <div className="h-7 w-60 bg-zinc-200 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white] p-4 rounded-2xl border border-zinc-100 animate-pulse">
                        <div className="aspect-video bg-zinc-200 rounded-xl mb-4"></div>
                        <div className="h-4 w-3/4 bg-zinc-200 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-zinc-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}