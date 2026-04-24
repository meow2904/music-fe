import Link from 'next/link';
import { Home, Music4 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full" />
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center relative border border-zinc-200 shadow-xl">
          <Music4 size={40} className="text-purple-600 opacity-80" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500">404</h1>
        <h2 className="text-xl font-bold text-zinc-800">Trang bạn tìm kiếm không tồn tại</h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Nhịp điệu dường như đã bị lạc mất. URL bạn nhập có thể bị sai hoặc đĩa nhạc đã bị gỡ khỏi hệ thống.
        </p>
      </div>

      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7000FF] text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/30"
      >
        <Home size={18} />
        Quay về Trang chủ
      </Link>
    </div>
  );
}
