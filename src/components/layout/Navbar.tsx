"use client";
import Image from "next/image";
import { NotificationMenu } from "../ui/NotificationMenu";
import { SearchInput } from "../ui/SearchInput";
import { useState, useEffect } from "react";
import { AuthModal } from "../ui/AuthModal";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { Settings, LogOut, User as UserIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { MenuDrawer } from "./MenuDrawer";

export function Navbar() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
                if (session?.user) {
                    setIsAuthModalOpen(false);
                }
            }
        );

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

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
                    {user?.email ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="p-0.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer ring-2 ring-transparent hover:ring-zinc-200 outline-none"
                            >
                                <img
                                    src={user.user_metadata?.avatar_url || "/anh-rose.jpg"}
                                    alt="User avatar"
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-zinc-200"
                                />
                            </button>

                            {isProfileMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-zinc-100 z-50 p-2 transform origin-top-right transition-all">
                                        <div className="px-3 py-2.5 mb-2 rounded-xl bg-zinc-50/50 cursor-default">
                                            <p className="text-xs text-zinc-500 font-medium mb-0.5">Đăng nhập với</p>
                                            <p className="font-bold text-sm truncate text-zinc-900">{user.email}</p>
                                        </div>

                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <Settings size={18} className="text-zinc-500" />
                                            <span className="font-semibold text-sm">Cài đặt</span>
                                        </button>

                                        <div className="h-px w-full bg-zinc-100 my-1"></div>

                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-colors group"
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                handleLogout();
                                            }}
                                        >
                                            <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
                                            <span className="font-semibold text-sm">Đăng xuất</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Button
                            onPress={() => setIsAuthModalOpen(true)}
                            className="bg-zinc-900 text-white font-medium rounded-full px-5 h-9 sm:h-10 text-sm hover:bg-zinc-800 transition-colors"
                        >
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onOpenChange={() => setIsAuthModalOpen(false)} />
        </header>
    );
}