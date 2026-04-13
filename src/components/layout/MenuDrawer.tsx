"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button } from "@heroui/react";
import { Music2, Heart, Globe2, UserPlus, Menu, Radio } from "lucide-react";
import Link from "next/link";


const menuItems = [
    { name: "Playlists", href: "/playlists", icon: Music2 },
    { name: "Liked Songs", href: "/liked", icon: Heart },
    { name: "My Music Room", href: "/myroom", icon: Radio },
    { name: "Online Rooms", href: "/online", icon: Globe2 },
    { name: "Find Friends", href: "/friends", icon: UserPlus },
];

export function MenuDrawer() {
    return (
        <Drawer>
            <Button variant="secondary" className="text-black bg-white hover:bg-gray-200">
                <Menu />
            </Button>
            <Drawer.Backdrop>
                <Drawer.Content placement="left" className="w-[250px]">
                    <Drawer.Dialog>
                        <Drawer.Header className="pb-3">
                            <Drawer.Heading>
                                <div className="flex items-center gap-3 w-full p-3">
                                    <Menu />
                                    <Link href="/" className="text-lg font-bold">Music System</Link>
                                </div>
                            </Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body>
                            <nav className="flex flex-col gap-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                                    >
                                        <item.icon className="size-5 text-muted" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}