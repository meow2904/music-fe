"use client";
import Image from "next/image";
import { NotificationMenu } from "../ui/NotificationMenu";
import { SearchInput } from "../ui/SearchInput";

import { cn } from "@/utils/cn";
import { MenuDrawer } from "./MenuDrawer";

export function Navbar() {
    return (
        <header suppressHydrationWarning className={cn(
            "flex items-center justify-between px-3 h-[60px] transition-all duration-300 z-50 w-full sm:px-5 bg-white backdrop-blur-md",
            "border-zinc-200 shadow-sm sticky top-0"
        )}>
            {/* Left section */}
            <div className="flex-1 flex justify-start items-center">
                <div className="hidden sm:block">
                    <MenuDrawer />
                </div>
            </div>

            {/* Center section */}
            <div className="flex justify-center shrink-0">
                <SearchInput />
            </div>

            {/* Right section */}
            <div className="flex-1 flex justify-end items-center gap-2">
                <div className="flex items-center gap-2" suppressHydrationWarning>
                    <NotificationMenu />
                </div>

                <div className="w-px h-6 bg-zinc-200 hidden sm:block mx-1" />

                <div className="flex shrink-0">
                    <Image
                        src="/anh-rose.jpg"
                        alt="User avatar"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                    />
                </div>
            </div>
        </header>
    );
}