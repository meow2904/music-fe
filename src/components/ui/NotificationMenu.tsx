"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, BellDot, Check } from "lucide-react";

// Dữ liệu mẫu (Sau này bạn thay bằng dữ liệu fetch từ API)
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: "Bản phát hành mới",
        message: "Album 'Midnight Pulse Vol. 4' đã chính thức ra mắt!",
        time: "2 phút trước",
        unread: true,
    },
    {
        id: 2,
        title: "Lời mời kết bạn",
        message: "@alex_jones đã gửi cho bạn một lời mời kết bạn.",
        time: "1 giờ trước",
        unread: true,
    },
    {
        id: 3,
        title: "Cập nhật Playlist",
        message: "Playlist 'Lofi Chill' vừa thêm 5 bài hát mới.",
        time: "2 ngày trước",
        unread: false,
    },
];

export function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const menuRef = useRef<HTMLDivElement>(null);

    const hasUnread = notifications.some(n => n.unread);

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hàm đánh dấu đã đọc tất cả
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Nút Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full transition-colors ${isOpen
                    ? "bg-zinc-100 text-purple-600"
                    : "text-zinc-500 hover:bg-zinc-100"
                    }`}
            >
                {hasUnread ? <BellDot size={20} /> : <Bell size={20} />}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 md:top-full top-auto max-md:fixed max-md:top-[60px] max-md:left-4 max-md:right-4 max-md:w-auto mt-2 md:w-96 bg-white border border-zinc-100 rounded-2xl shadow-xl z-[100] overflow-hidden flex flex-col transform opacity-100 scale-100 transition-all max-md:origin-top md:origin-top-right">

                    {/* Header của Menu */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-50">
                        <h3 className="font-bold text-sm text-zinc-900">Thông báo</h3>
                        {hasUnread && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] flex items-center gap-1 font-medium text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                <Check size={12} />
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    {/* Danh sách thông báo */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="flex flex-col">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? "bg-purple-50/50" : ""
                                            }`}
                                    >
                                        {/* Chấm xanh hiển thị trạng thái chưa đọc */}
                                        <div className="mt-1.5 w-2 h-2 rounded-full shrink-0">
                                            {notif.unread && <div className="w-full h-full bg-purple-600 rounded-full" />}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm ${notif.unread ? "font-bold text-zinc-900" : "font-medium text-zinc-700"}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-zinc-500 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-zinc-400 font-medium pt-1">
                                                {notif.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center gap-2">
                                <Bell className="text-zinc-300 mb-2" size={32} />
                                <p className="text-sm text-zinc-500">Bạn chưa có thông báo mới nào</p>
                            </div>
                        )}
                    </div>

                    {/* Footer của Menu */}
                    <button className="p-3 text-xs font-bold text-center text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 transition-colors">
                        Xem tất cả thông báo
                    </button>
                </div>
            )}
        </div>
    );
}