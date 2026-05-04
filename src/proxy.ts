import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default async function proxy(request: NextRequest) {


    // 1. Lấy thông tin session từ Supabase Middleware
    const { supabaseResponse, user } = await updateSession(request)

    // 2. Kiểm tra xem người dùng đã đăng nhập chưa
    const isAuthenticated = !!user

    // 3. Xác định các route cần bảo vệ (private routes)
    // Các route nằm trong list này đòi hỏi phải đăng nhập mới được truy cập
    const privateRoutes = ['/playlist', '/profile', '/user']

    // Hàm helper để kiểm tra xem path hiện tại có nằm trong privateRoutes không
    const isProtectedRoute = (path: string) => {
        return privateRoutes.some(route => path.startsWith(route))
    }

    // 4. Kiểm tra xem request hiện tại có phải là request tới private route không
    const isAccessingProtectedRoute = isProtectedRoute(request.nextUrl.pathname)

    // Hàm tiện ích để copy cookies khi chuyển hướng
    const redirectWithCookies = (url: URL) => {
        const redirectResponse = NextResponse.redirect(url)
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    // 5. Điều hướng người dùng dựa trên trạng thái đăng nhập

    // Trường hợp 1: Người dùng chưa đăng nhập (unauthenticated)
    if (!isAuthenticated) {
        // Nếu người dùng cố gắng truy cập private route, chuyển hướng họ đến trang chủ (do hiện không có trang /auth/sign-in)
        if (isAccessingProtectedRoute) {
            const signInUrl = new URL('/', request.url)
            return redirectWithCookies(signInUrl)
        }
        // Còn lại (truy cập public pages), cho phép đi tiếp
        return supabaseResponse
    }

    // Trường hợp 2: Người dùng đã đăng nhập (authenticated)
    if (isAuthenticated) {
        // Nếu người dùng cố gắng truy cập trang đăng nhập/đăng ký, chuyển hướng họ về trang chủ (hoặc trang manage tuỳ app của bạn)
        if (request.nextUrl.pathname.startsWith('/auth/sign-in') ||
            request.nextUrl.pathname.startsWith('/auth/sign-up')) {
            const manageUrl = new URL('/', request.url)
            return redirectWithCookies(manageUrl)
        }

        // Các trường hợp khác, cho phép đi tiếp
        return supabaseResponse
    }

    // Fallback: Mặc định cho phép request đi qua
    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
