"use client";
import Image from "next/image";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NotificationMenu } from "../ui/NotificationMenu";
import { SearchInput } from "../ui/SearchInput";

import { cn } from "@/utils/cn";

interface NavbarProps {
    isCollapsed: boolean;
}

export function Navbar({ isCollapsed }: NavbarProps) {
    return (
        <header suppressHydrationWarning className={cn(
            "relative flex items-center gap-2 px-3 h-[64px] md:h-[80px] border-b border-zinc-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-all duration-300 z-10 w-full",
            isCollapsed ? "sm:pr-5 sm:pl-[180px]" : "sm:px-5" // Đồng bộ hóa breakpoint "sm:" vì chế độ Tablet (640px) Sidebar đã xuất hiện
        )}>

            {/* Logo cho Mobile */}
            <div className="flex sm:hidden items-center pr-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500 truncate tracking-tight">
                    Sonic
                </span>
            </div>

            {/* Dồn toàn bộ các icon sang góc phải trên Mobile bằng ml-auto ở div bọc Search */}
            <div className="flex items-center ml-auto sm:ml-0">
                <SearchInput />
            </div>

            {/* Các icon đi theo cụm đẩy sang phải trên Desktop (sm:ml-auto) */}
            <div className="flex items-center gap-2 sm:ml-auto" suppressHydrationWarning>
                <ThemeToggle />
                <NotificationMenu />
            </div>

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />

            {/* Avatar sẽ bị đẩy xa ra ở góc phải trên Mobile nhờ ml-auto, trên Desktop sẽ dính liền với menu */}
            <div className="flex shrink-0">
                <Image
                    src="/anh-rose.jpg"
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
            </div>
        </header>
    );
}