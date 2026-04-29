"use client"
import { ModalCustom } from "@/components/ui/Modal";
import { createClient } from "@/utils/supabase/client";
import { Globe, Plus, Lock } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function convertToSlug(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD') // Chuẩn hóa Unicode để tách dấu
        .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
        .replace(/[đĐ]/g, 'd') // Xử lý chữ đ
        .replace(/([^0-9a-z-\s])/g, '') // Xóa ký tự đặc biệt
        .replace(/(\s+)/g, '-') // Thay khoảng trắng bằng gạch ngang
        .replace(/-+/g, '-') // Xóa gạch ngang thừa
        .replace(/^-+|-+$/g, ''); // Xóa gạch ngang ở đầu và cuối
}

export function CreateRoomModal() {
    const [privacy, setPrivacy] = useState(true); //true public, false private
    const [roomName, setRoomName] = useState("");

    const [slug, setSlug] = useState("your-room-name");
    const [isLoading, setIsLoading] = useState(false);

    const [user, setUser] = useState<string>("");
    useEffect(() => {
        async function getUser() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user?.user_metadata.full_name || user?.user_metadata.email || "user");
        }
        getUser();
    }, []);

    function handleOpen() {
        setRoomName("");
        setSlug("your-room-name");
        setPrivacy(true);
        setIsLoading(false);
    }

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;
        setRoomName(name);
        if (name.trim() === "") {
            setSlug("your-room-name");
        } else {
            setSlug(convertToSlug(name));
        }
    }

    const handleCreateRoom = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: roomName,
                    is_public: privacy,
                    slug: slug,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Phòng đã được tạo thành công!");
            } else {
                if (response.status === 400 && data.existingRoom) {
                    toast.error(data.error || "Lỗi khi tạo phòng");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalCustom
            title="Tạo mới phòng nghe nhạc"
            action={<div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-zinc-700 font-medium text-sm transition">
                    <Plus className="w-4 h-4 text-zinc-400" />
                    Thêm
                </div>
            </div>}
            onSave={() => handleCreateRoom()}
            saveLabel="Tạo mới"
            onOpen={handleOpen}
            isLoading={isLoading}
        >
            <div className="flex flex-col gap-6 py-2">
                {/* Owner Info Tag */}
                <div className="w-full bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-sm font-medium text-green-800">
                        Owner: <span className="font-bold">{user}</span>
                    </span>
                </div>
                {/* Section: Tên phòng */}
                <section>
                    <label className="text-sm font-bold text-zinc-700 block mb-2">Tên phòng</label>
                    <input
                        type="text"
                        placeholder="Nhạc buồn 2h sáng, Chill cuối tuần, Vibe yêu xa..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all text-zinc-900 placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={roomName}
                        onChange={handleNameChange}
                        disabled={isLoading}
                    />
                </section>

                {/* Section: Đường dẫn */}
                <section>
                    <label className="text-sm font-bold text-zinc-700 block mb-2">Đường dẫn phòng</label>
                    <div className="flex items-center px-4 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 font-mono text-sm">
                        <span>/room/</span>
                        <span className="text-zinc-900 font-semibold ml-1">{slug}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 italic">Tự động tạo từ tên phòng. Không thể thay đổi sau khi tạo.</p>
                </section>

                {/* Section: Chế độ phòng */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setPrivacy(true)}
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${privacy === true
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-zinc-100 text-zinc-500 bg-white"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Globe className="w-4 h-4" /> Công khai
                    </button>
                    <button
                        onClick={() => setPrivacy(false)}
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${privacy === false
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-zinc-100 text-zinc-500 bg-white"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Lock className="w-4 h-4" /> Riêng tư
                    </button>
                </div>
                <p className="text-[11px] text-zinc-400 text-center -mt-2">
                    {privacy === true ? "Phòng sẽ hiển thị trong danh sách công khai ở trang chủ." : "Chỉ những người có link mới có thể tham gia."}
                </p>
            </div>
        </ModalCustom>
    )
}