import { Music4, ArrowRight } from "lucide-react";

interface RoomCardProps {
    roomName: string;
    isStreaming: boolean;
    listenerCount: number;
    songCount: number;
    tags?: string[];
    avatarUrl?: string; // Tạm thời dùng ảnh mock nếu cần
}

const AvatarStack = ({ count }: { count: number }) => {
    // Mock dữ liệu avatar
    const avatars = [
        '/anh-rose.jpg',
        '/anh-rose.jpg',
        '/anh-rose.jpg',
    ];
    return (
        <div className="flex items-center -space-x-3">
            {avatars.slice(0, 3).map((src, index) => (
                <img
                    key={index}
                    className="inline-block h-6 w-6 shrink-0 rounded-full ring-2 ring-white object-cover"
                    src={src}
                    alt={`User ${index + 1}`}
                />
            ))}
            {count > 3 && (
                <div className="flex shrink-0 items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-zinc-100 ring-2 ring-white text-[10px] text-zinc-600 font-medium">
                    +{count - 3}
                </div>
            )}
        </div>
    );
};

export function RoomCard({ roomName, isStreaming, listenerCount, songCount, tags }: RoomCardProps) {
    return (
        <div className="bg-linear-to-r from-violet-400/40 to-blue-500/40 border border-zinc-200/80 rounded-2xl p-3 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex gap-4 items-start pb-2">
                {/* Mock Room Icon/Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                    <Music4 className="w-7 h-7 text-zinc-500" />
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 text-lg leading-tight line-clamp-2">
                        {roomName}
                    </h3>
                    {isStreaming && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-medium text-emerald-600">Đang phát</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {/* {tags && tags.length > 0 && (
                    <div className="flex flex-col gap-1.5 items-end shrink-0">
                        {tags.map(tag => (
                            <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                )} */}
            </div>

            {/* Middle Section (Info & Avatars) */}
            <div className="flex items-center gap-4 border-y border-zinc-100 py-3">
                <AvatarStack count={listenerCount} />
                <div className="text-sm text-zinc-600 flex items-center gap-3">
                    <span>
                        <strong className="font-semibold text-zinc-800">{listenerCount}</strong> đang nghe
                    </span>
                    <span className="text-zinc-300">|</span>
                    <span>
                        <strong className="font-semibold text-zinc-800">{songCount}</strong> bài
                    </span>
                </div>
            </div>

            {/* Bottom Section (Action) */}
            <div className="flex justify-between items-center text-zinc-600 group-hover:text-emerald-600 transition-colors pt-2">
                <span className="font-medium text-sm hover:cursor-pointer">Nghe cùng</span>
                <ArrowRight className="w-5 h-5 hover:cursor-pointer hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
}