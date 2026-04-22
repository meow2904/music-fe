"use client";
import { Modal, ModalHeader, ModalBody, Button, Input, } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AuthModal({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {
    const supabase = createClient();
    const [isLogin, setIsLogin] = useState(true); // Toggle giữa Đăng nhập & Đăng ký

    // 1. Đăng nhập Google (OAuth)
    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Sau khi đăng nhập Google xong sẽ nhảy về callback để xử lý session
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    // 2. Đăng ký/Đăng nhập bằng Email
    const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
            else onOpenChange(); // Đóng modal khi thành công
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) alert("Kiểm tra email để xác nhận tài khoản!");
            else onOpenChange();
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.Header className="flex flex-col gap-1 text-center text-2xl font-bold">
                        {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
                    </Modal.Header>
                    <Modal.Body>
                        {/* Option 1: Google */}
                        <Button
                            fullWidth
                            onClick={handleGoogleLogin}
                            className="font-medium"
                        >
                            Tiếp tục với Google
                        </Button>

                        <div className="flex items-center gap-4 my-2">
                            {/* <Divider className="flex-1" /> */}
                            <span className="text-zinc-400 text-xs">HOẶC</span>
                            {/* <Divider className="flex-1" /> */}
                        </div>

                        {/* Option 2: Email Form */}
                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
                            <Input name="email" placeholder="Email" type="email" required />
                            <Input name="password" placeholder="Mật khẩu" type="password" required />

                            <Button type="submit" className="font-bold shadow-lg shadow-primary/20">
                                {isLogin ? "Đăng nhập" : "Đăng ký ngay"}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-zinc-500 mt-2">
                            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                            <span
                                className="text-primary cursor-pointer hover:underline font-semibold"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Đăng ký" : "Đăng nhập"}
                            </span>
                        </p>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
}