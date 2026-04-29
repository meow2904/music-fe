"use client";

import { Search, History, Trash2, X, ArrowLeft, Music2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState, useRef, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import useSWR from "swr";
import { useRouter } from "next/navigation"; // Lưu ý: dùng next/navigation cho App Router

interface SearchHistoryItem {
    id: number;
    text: string;
    timestamp: number;
}

export function SearchInput({ containerClassName, className, ...props }: any) {
    const [query, setQuery] = useState("");
    const debouncedSearch = useDebounce(query, 300);
    const [isFocused, setIsFocused] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { data: suggestions } = useSWR(
        debouncedSearch.trim() ? `/api/youtube/suggestions?q=${encodeURIComponent(debouncedSearch.trim())}` : null,
        (url) => fetch(url).then(res => res.json())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setIsMobileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: history = [], mutate: mutateHistory } = useSWR<SearchHistoryItem[]>("search_history", null, { fallbackData: [] });

    const addToHistory = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        mutateHistory(prev => {
            const current = prev || [];
            // Xoá trùng & giữ tối đa 10 cái
            const filtered = current.filter(item => item.text.toLowerCase() !== trimmed.toLowerCase());
            const updated = [{ id: Date.now(), text: trimmed, timestamp: Date.now() }, ...filtered].slice(0, 10);
            return updated;
        }, false); // false để chỉ update UI, không fetch lại
    };

    const handleDeleteHistory = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        mutateHistory(prev => {
            const current = prev || [];
            const updated = current.filter(item => item.id !== id);
            return updated;
        }, false);
    };

    const handleSelectTrack = (track: any) => {
        setQuery(track.title);
        addToHistory(track.title);
        setIsFocused(false);
        setIsMobileOpen(false);
        router.push(`/search?q=${encodeURIComponent(track.title)}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        addToHistory(query);
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsFocused(false);
    };

    const showSuggestions = isFocused && query.length > 0 && suggestions?.length > 0;
    const showHistory = isFocused && query.length === 0 && history.length > 0;
    const showDropdown = showSuggestions || showHistory;

    useEffect(() => {
        if (suggestions && suggestions.length > 0) {
            console.log("--- Danh sách Suggestion mới ---");
            console.log(suggestions); // Dùng console.table để nhìn dạng bảng cho đẹp
        }
    }, [suggestions]);
    return (
        <>
            {!isMobileOpen && (
                <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-2.5 rounded-full text-zinc-500 hover:bg-zinc-100 transition">
                    <Search size={20} />
                </button>
            )}

            <div ref={containerRef} className={cn(
                "transition-all z-50",
                isMobileOpen ? "fixed inset-0 h-16 px-4 flex items-center bg-white max-md:z-100" : "hidden md:block w-full max-w-sm lg:max-w-lg",
                containerClassName
            )}>
                <div className="relative w-full flex items-center gap-2">
                    {isMobileOpen && (
                        <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 text-zinc-500"><ArrowLeft size={20} /></button>
                    )}

                    <div className="relative w-full">
                        <form onSubmit={handleSearch} className={cn(
                            "relative flex items-center w-full bg-zinc-100] transition-all border border-zinc-200",
                            showDropdown ? "rounded-t-2xl bg-white shadow-2xl" : "rounded-full focus-within:border-purple-500/50"
                        )}>
                            <button type="submit" className="absolute left-4 text-zinc-400 hover:text-purple-500 transition-colors">
                                <Search size={18} />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                placeholder="Tìm bài hát, nghệ sĩ..."
                                className="w-full h-11 pl-12 pr-10 bg-transparent text-sm outline-none"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setQuery("");
                                        inputRef.current?.focus();
                                    }}
                                    className="absolute right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-2xl border border-t-0 border-zinc-200 z-50 max-h-[400px] overflow-y-auto">

                                {/* HIỂN THỊ GỢI Ý TỪ KHÓA */}
                                {showSuggestions && (
                                    <div className="py-2">
                                        <p className="px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gợi ý kết quả</p>
                                        {suggestions.map((track: any) => (
                                            <div
                                                key={track.id}
                                                onClick={() => handleSelectTrack(track)}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-100 cursor-pointer transition-colors group"
                                            >
                                                <Search size={16} className="text-zinc-400 group-hover:text-purple-500 transition-colors shrink-0" />
                                                <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 truncate">{track.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* HIỂN THỊ LỊCH SỬ (Chỉ hiện khi chưa gõ gì) */}
                                {showHistory && (
                                    <div className="py-2">
                                        <p className="px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tìm kiếm gần đây</p>
                                        {history.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-zinc-100 cursor-pointer group">
                                                <div className="flex items-center gap-3 flex-1" onClick={() => { setQuery(item.text); addToHistory(item.text); router.push(`/search?q=${encodeURIComponent(item.text)}`); }}>
                                                    <History size={16} className="text-zinc-400" />
                                                    <span className="text-sm text-zinc-600">{item.text}</span>
                                                </div>
                                                <button onClick={(e) => handleDeleteHistory(e, item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}