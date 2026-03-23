import { Navbar } from "./Navbar";
import { PlayerControl } from "./PlayerControl";
import { BottomNav } from "./BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        // <div className="flex h-dvh w-full bg-[#0A0A0A] text-zinc-100 overflow-hidden relative">
        <div className="flex h-dvh w-full overflow-hidden relative">

            {/* 2. KHU VỰC NỘI DUNG CHÍNH */}
            <div className="flex flex-col flex-1 min-w-0 w-full">
                <Navbar />

                {/* Thêm padding-bottom (pb-32) trên Mobile để không bị che bởi Mini Player + Bottom Nav */}
                <main className="flex-1 overflow-y-auto pb-40 md:pb-28 p-4 md:p-8 lg:p-10">
                    {children}
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