import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { PlayerControl } from "@/components/layout/PlayerControl";
import { BottomNav } from "@/components/layout/BottomNav"; // Component mới cho Mobile

export default function HomePage() {
    return (
        // Dùng h-[100dvh] để fix lỗi thanh địa chỉ của Safari trên iOS
        <div className="flex h-dvh w-full bg-[#0A0A0A] text-zinc-100 overflow-hidden relative">

            {/* 1. SIDEBAR: Ẩn trên Mobile, hiện từ Tablet (md) trở lên */}
            <div className="hidden md:flex shrink-0">
                <Sidebar />
            </div>

            {/* 2. KHU VỰC NỘI DUNG CHÍNH */}
            <div className="flex flex-col flex-1 min-w-0 w-full">
                <Navbar />

                {/* Thêm padding-bottom (pb-32) trên Mobile để không bị che bởi Mini Player + Bottom Nav */}
                <main className="flex-1 overflow-y-auto pb-40 md:pb-28 p-4 md:p-8 lg:p-10">

                    <div className="flex gap-8">
                        {/* Cột trái (Nội dung chính) */}
                        <div className="flex-1 space-y-8">
                            {/* <HeroBanner /> */}
                            {/* <RecommendedList /> */}

                            {/* Khối Friend Activity: Hiện trên Mobile/Tablet nhỏ, Ẩn trên Desktop (lg) */}
                            <div className="block lg:hidden">
                                {/* <FriendActivity /> */}
                            </div>
                        </div>

                        {/* Cột phải (Chat & Friends): Ẩn trên Mobile/Tablet, chỉ hiện trên Desktop (lg) */}
                        <div className="hidden lg:flex w-80 flex-col gap-6 shrink-0">
                            {/* <FriendActivity /> */}
                            {/* <ChatRoom /> */}
                        </div>
                    </div>

                </main>
            </div>

            {/* 3. PLAYER CONTROL: Tự động thu nhỏ trên Mobile, phóng to trên Tablet/Desktop */}
            <PlayerControl />

            {/* 4. BOTTOM NAV: Chỉ hiện trên Mobile (dưới md), ẩn trên Tablet/Desktop */}
            <div className="block md:hidden">
                <BottomNav />
            </div>

        </div>
    );
}