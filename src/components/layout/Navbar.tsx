"use client";
import { Sidebar } from "./Sidebar";
import Image from "next/image";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NotificationMenu } from "../ui/NotificationMenu";
import { SearchInput } from "../ui/SearchInput";

export function Navbar() {
    return (
        <header suppressHydrationWarning className="relative flex items-center justify-end md:justify-between gap-2 p-3 md:p-5 border-b border-zinc-100 bg-white 
                      dark:bg-zinc-950 dark:border-zinc-800 transition-colors">
            <Sidebar />
            <SearchInput />

            <div className="flex items-center gap-2" suppressHydrationWarning>
                <ThemeToggle />
                <NotificationMenu />
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />

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