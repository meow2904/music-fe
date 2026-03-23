"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NotificationMenu } from "../ui/NotificationMenu";
import { SearchInput } from "../ui/SearchInput";

export function Navbar() {
    return (
        <header suppressHydrationWarning className="relative flex items-center justify-between p-8 border-b border-zinc-100 bg-white 
                      dark:bg-zinc-950 dark:border-zinc-800 transition-colors">
            <SearchInput />

            <div className="flex items-center gap-2" suppressHydrationWarning>
                <ThemeToggle />
                <NotificationMenu />
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />
                <div className="flex items-center gap-3">
                    <Image
                        src="/anh-rose.jpg"
                        alt="User avatar"
                        width={36}
                        height={36}
                        className="rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                </div>
            </div>
        </header>
    );
}