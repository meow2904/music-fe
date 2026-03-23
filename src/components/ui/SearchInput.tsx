"use client";

import { Search, History, Trash2, X, ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { InputHTMLAttributes, useState, useRef, useEffect } from "react";

// Dữ liệu mẫu cho lịch sử tìm kiếm
const MOCK_HISTORY = [
    { id: 1, text: "vở kịch của em karaoke" },
    { id: 2, text: "midnight pulse vol 4" },
    { id: 3, text: "lofi chill không lời" },
];

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    containerClassName?: string;
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [history, setHistory] = useState(MOCK_HISTORY);
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Trạng thái mở riêng cho mobile

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Xử lý click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                // Nếu click ra ngoài ở mobile thì có thể tự động đóng (tuỳ chọn)
                setIsMobileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus vào input khi mở trên bản mobile
    useEffect(() => {
        if (isMobileOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMobileOpen]);

    const handleDeleteHistory = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setHistory(history.filter(item => item.id !== id));
    };

    const handleSelectHistory = (text: string) => {
        setQuery(text);
        setIsFocused(false);
        setIsMobileOpen(false);
    };

    const showDropdown = isFocused && history.length > 0;

    return (
        <>
            {/* ====== MOBILE: NÚT TÌM KIẾM (CHỈ HIỆN KHI CHƯA MỞ) ====== */}
            {!isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="md:hidden p-2.5 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
                >
                    <Search size={20} />
                </button>
            )}

            {/* ====== KHUNG TÌM KIẾM (MỞ RỘNG TRÊN MOBILE HOẶC LUÔN HIỆN TRÊN DESKTOP) ====== */}
            <div
                ref={containerRef}
                className={cn(
                    "transition-all z-50",
                    // MOBILE: Ở trạng thái mở, cho z-index thật cao, chiếm full vị trí phía trên
                    isMobileOpen
                        ? "absolute inset-x-0 top-0 h-full px-4 flex items-center bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 max-md:z-100"
                        : "hidden md:block w-full max-w-sm lg:max-w-lg", // Ẩn trên mobile nếu chưa ấn nút
                    containerClassName
                )}
            >
                <div className="relative w-full flex items-center gap-2">
                    {/* Nút quay lại chỉ hiện trên Mobile khi đang mở */}
                    {isMobileOpen && (
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    {/* Vùng Input & Dropdown bọc trong 1 khối để thả bóng (shadow) chung */}
                    <div className="relative w-full">
                        <div className={cn(
                            "relative flex items-center w-full bg-zinc-100 dark:bg-[#121212] transition-all",
                            showDropdown ? "rounded-t-2xl border-b border-zinc-200 dark:border-zinc-800" : "rounded-full"
                        )}>
                            <Search
                                className="absolute left-4 text-zinc-400 dark:text-zinc-500"
                                size={18}
                            />

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                                className={cn(
                                    "w-full h-11 pl-12 pr-10 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none",
                                    className
                                )}
                                {...props}
                            />

                            {/* Nút X để xóa chữ */}
                            {query && (
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        inputRef.current?.focus();
                                    }}
                                    className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Gợi ý / Lịch sử */}
                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 bg-zinc-100 dark:bg-[#121212] rounded-b-2xl shadow-xl overflow-hidden border-t-0 z-50">
                                <ul className="flex flex-col py-2">
                                    {history.map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() => handleSelectHistory(item.text)}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 cursor-pointer group transition-colors"
                                        >
                                            <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-300">
                                                <History size={16} className="text-zinc-400 dark:text-zinc-500" />
                                                <span className="text-sm font-medium">{item.text}</span>
                                            </div>

                                            <button
                                                onClick={(e) => handleDeleteHistory(e, item.id)}
                                                className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}