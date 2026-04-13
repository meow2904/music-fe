import { ChevronDown } from "lucide-react";
import { RoomCard } from "./room-card";

interface RoomGridProps {
    rooms: any[]; // Thay 'any' bằng interface Room dữ liệu thực tế
}

export function RoomGrid({ rooms }: RoomGridProps) {
    return (
        <div className="mt-8">
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <RoomCard key={room.id} {...room} />
                ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-12 mb-8">
                <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-zinc-800 border border-zinc-200 font-medium text-sm shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition">
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                    Xem thêm phòng
                </button>
            </div>
        </div>
    );
}