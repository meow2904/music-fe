"use client";
import { Modal, ModalHeader, ModalBody, Button, Input } from "@heroui/react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

// Google Icon SVG (có thể tách ra component riêng)
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
        <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
        <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03296C-0.371021 20.0112 -0.371021 28.0009 3.03296 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
        <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6869 13.0973L40.5387 6.24553C36.2005 2.18871 30.4226 -0.0689105 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2296L11.0051 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
    </svg>
);

export function AuthModal({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {
    const supabase = createClient();
    const [isLogin, setIsLogin] = useState(true);
    const [isVisible, setIsVisible] = useState(false); // Toggle ẩn/hiện password
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const [isForgotPassword, setIsForgotPassword] = useState(false); // Trạng thái quên mật khẩu

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
            });

            if (error) {
                toast.error("Không thể gửi email khôi phục. Vui lòng thử lại sau.");
            } else {
                toast.success("Đã gửi link khôi phục! Vui lòng kiểm tra email của bạn.");
                setIsForgotPassword(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    toast.error("Sai tên đăng nhập hoặc mật khẩu");
                } else {
                    toast.success("Đăng nhập thành công!");
                    onOpenChange();
                }
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    toast.error("Email đã tồn tại");
                } else {
                    toast.success("Kiểm tra email để xác nhận tài khoản!");
                    onOpenChange();
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog className="bg-white rounded-[24px] p-4 shadow-2xl">

                        {/* Header */}
                        <Modal.Header className="flex flex-col gap-1 text-center pt-6 pb-2">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                {isForgotPassword ? "Khôi phục mật khẩu" : (isLogin ? "Chào mừng trở lại" : "Tạo tài khoản")}
                            </h2>
                            <p className="text-sm font-medium text-zinc-500">
                                {isForgotPassword ? "Nhập email để nhận link đặt lại mật khẩu" : "Hãy bước vào thế giới âm nhạc của SONIC"}
                            </p>
                        </Modal.Header>

                        <Modal.Body className="pb-6 px-3">
                            {isForgotPassword ? (
                                <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 mt-2">
                                    {/* Email Input */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-zinc-800">Email của bạn</label>
                                        <div className="relative flex items-center">
                                            <div className="absolute left-3">
                                                <Mail className="w-4 h-4 text-zinc-400" />
                                            </div>
                                            <Input
                                                name="email"
                                                placeholder="name@example.com"
                                                type="email"
                                                className="pl-10 h-12 w-full border border-zinc-200 rounded-md bg-white shadow-none outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4 gap-3">
                                        <Button
                                            type="button"
                                            // variant="flat"
                                            className="h-12 w-full font-bold text-zinc-700 bg-zinc-100 rounded-xl"
                                            onPress={() => setIsForgotPassword(false)}
                                            isDisabled={isLoading}
                                        >
                                            Hủy
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
                                            Gửi link
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Option 1: Google */}
                                    <Button
                                        fullWidth
                                        variant="outline"
                                        className="font-semibold text-zinc-700 bg-white border border-zinc-200 h-12 rounded-xl flex items-center justify-center gap-2"
                                        onClick={handleGoogleLogin}
                                        isDisabled={isLoading}
                                    >
                                        <GoogleIcon />
                                        Tiếp tục với Google
                                    </Button>

                                    {/* Divider */}
                                    <div className="flex items-center w-full my-4">
                                        <div className="flex-1 border-b border-zinc-200"></div>
                                        <span className="px-3 text-[10px] font-bold tracking-wider text-zinc-400">
                                            HOẶC EMAIL
                                        </span>
                                        <div className="flex-1 border-b border-zinc-200"></div>
                                    </div>

                                    {/* Option 2: Email Form */}
                                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">

                                        {/* Email Input */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-zinc-800">Email</label>
                                            <div className="relative flex items-center">
                                                <div className="absolute left-3">
                                                    <Mail className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <Input
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    type="email"
                                                    className="pl-10 h-12 w-full border border-zinc-200 rounded-md bg-white shadow-none outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                    required
                                                    disabled={isLoading}
                                                    tabIndex={1}
                                                />
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-zinc-800">Mật khẩu</label>
                                                {isLogin && (
                                                    <a
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }}
                                                        className="text-xs font-bold text-indigo-600 hover:underline"
                                                        tabIndex={4}
                                                    >
                                                        Quên mật khẩu?
                                                    </a>
                                                )}
                                            </div>
                                            <div className="relative flex items-center">
                                                <div className="absolute left-3">
                                                    <Lock className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <Input
                                                    name="password"
                                                    placeholder="........"
                                                    type={isVisible ? "text" : "password"}
                                                    className="pl-10 pr-10 h-12 w-full border border-zinc-200 rounded-md bg-white shadow-none tracking-widest outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                    required
                                                    disabled={isLoading}
                                                    tabIndex={2}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsVisible(!isVisible)}
                                                    className="absolute right-3 focus:outline-none"
                                                    tabIndex={3}
                                                >
                                                    {isVisible ? (
                                                        <EyeOff className="w-4 h-4 text-zinc-400" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-zinc-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Login/Submit Button */}
                                        <div className="flex justify-center mt-2">
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
                                                {isLogin ? "Đăng nhập" : "Tham gia ngay"}
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Footer text */}
                                    <p className="text-center text-sm text-zinc-600 mt-4 font-medium">
                                        {isLogin ? "Mới sử dụng SONIC?" : "Đã có tài khoản?"}{" "}
                                        <span
                                            className="text-indigo-600 cursor-pointer hover:underline font-bold"
                                            onClick={() => setIsLogin(!isLogin)}
                                        >
                                            {isLogin ? "Tham gia ngay" : "Đăng nhập"}
                                        </span>
                                    </p>
                                </>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}