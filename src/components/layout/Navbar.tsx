"use client";
import Image from "next/image";
import { NotificationMenu } from "../ui/NotificationMenu";
import { SearchInput } from "../ui/SearchInput";
import { useState, useEffect } from "react";
import { AuthModal } from "../ui/AuthModal";
import { createClient } from "@/lib/supabase/client";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { User } from "@supabase/supabase-js";

import { cn } from "@/utils/cn";
import { MenuDrawer } from "./MenuDrawer";

export function Navbar() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
                    {user ? (
                        <Dropdown>
                            <DropdownTrigger>
                                <img
                                    src={user.user_metadata?.avatar_url || "/anh-rose.jpg"}
                                    alt="User avatar"
                                    className="w-9 h-9 rounded-full object-cover border border-zinc-200 cursor-pointer"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" >
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Đăng nhập bằng</p>
                                    <p className="font-semibold">{user.email}</p>
                                </DropdownItem>
                                <DropdownItem key="settings">Cài đặt</DropdownItem>
                                <DropdownItem key="logout" onPress={handleLogout}>
                                    Đăng xuất
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <Button onPress={() => setIsAuthModalOpen(true)}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onOpenChange={() => setIsAuthModalOpen(false)} />
        </header>
    );
}