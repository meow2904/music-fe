"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, Input, Modal } from "@heroui/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
    const supabase = createClient();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Gọi API update user để đổi mật khẩu
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                toast.error("Không thể cập nhật mật khẩu: " + error.message);
            } else {
                toast.success("Đổi mật khẩu thành công!");
                router.push("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true}>
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog className="bg-white rounded-[24px] p-4 shadow-2xl">

                        {/* Header */}
                        <Modal.Header className="flex flex-col gap-1 text-center pt-6 pb-2">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                Cập nhật mật khẩu
                            </h2>
                            <p className="text-sm font-medium text-zinc-500">
                                Hãy cập nhật mật khẩu mới cho tài khoản
                            </p>
                        </Modal.Header>

                        <Modal.Body className="pb-6 px-3">
                            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-zinc-800">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu mới..."
                                        className="h-12 w-full border border-zinc-200 rounded-md px-3 outline-none focus:border-indigo-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>



                                {/* Login/Submit Button */}
                                <div className="flex justify-center mt-2 gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => router.push("/")}
                                        className="h-12 w-full font-bold text-zinc-800 bg-zinc-100 rounded-xl flex items-center justify-center gap-2"
                                        isDisabled={isLoading}
                                    >
                                        Quay lại trang chủ
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-12 w-full font-bold text-white shadow-md shadow-indigo-500/30 bg-linear-to-r from-indigo-500 to-pink-400 rounded-xl flex items-center justify-center gap-2"
                                        isDisabled={isLoading}
                                    >
                                        {isLoading && (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        Xác nhận
                                    </Button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal >
    );
}