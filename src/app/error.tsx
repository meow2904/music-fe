'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, TriangleAlert } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-red-500/20 blur-xl rounded-full" />
        <div className="w-24 h-24 bg-red-50/50 dark:bg-zinc-900 rounded-full flex items-center justify-center relative border border-red-200 dark:border-zinc-800 shadow-xl">
          <TriangleAlert size={40} className="text-red-600 dark:text-red-500 opacity-80" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-red-600 dark:text-red-500">Lỗi Hệ Thống!</h1>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Đĩa nhạc bị kẹt</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Đã có lỗi nhỏ xảy ra khi xử lý thông tin. Tuy nhiên âm nhạc vẫn đang được phát liên tục.
        </p>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm hover:scale-105 active:scale-95 transition-all outline-none"
        >
          Thử Lại
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7000FF] text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/30"
        >
          <Home size={18} />
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
