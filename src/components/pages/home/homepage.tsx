export default function HomePage() {
    return (
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
    );
}