import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const roomTableName = "rooms"
const roomMembersTableName = "room_members"

export async function POST(request: Request) {
    try {

        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Chưa xác thực người dùng" }, { status: 401 });
        }

        const { data: existingRoom } = await supabase
            .from(roomTableName)
            .select("*")
            .eq("host_id", user.id)
            .single();

        if (existingRoom) {
            return NextResponse.json(
                {
                    error: "Bạn đang là chủ của một phòng khác. Vui lòng đóng phòng cũ trước khi tạo phòng mới.",
                    existingRoom: existingRoom
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, is_public, slug } = body;

        if (!name) {
            return NextResponse.json({ error: "Tên phòng không được để trống" }, { status: 400 });
        }

        const newRoom = {
            name: name,
            slug: slug,
            host_id: user.id,
            is_playing: false,
            seek_time: 0,
            is_public: is_public,
        };
        const { data, error } = await supabase
            .from(roomTableName)
            .insert(newRoom)
            .select()
            .single();

        if (error) {
            console.error("Supabase Insert Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { error: memberError } = await supabase
            .from(roomMembersTableName)
            .insert({
                room_id: data.id,
                member_id: user.id
            });

        if (memberError) {
            console.error("Lỗi khi thêm host vào room_members:", memberError);
            // Rollback (xóa phòng vừa tạo)
            await supabase.from(roomTableName).delete().eq("id", data.id);
            return NextResponse.json({ error: "Có lỗi xảy ra khi thiết lập phòng. Đã hủy tạo phòng." }, { status: 500 });
        }
        return NextResponse.json({ data }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: rooms, error } = await supabase
            .from(roomTableName)
            .select(`
                *,
                room_members (
                    member_id,
                    user (
                        id,
                        fullname,
                        email
                    )
                )
            `)
            .eq("is_public", true)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Lỗi khi fetch danh sách phòng:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Format lại cấu trúc dữ liệu cho Frontend dễ sử dụng
        // Lược bỏ bớt các mảng lồng nhau không cần thiết
        const formattedRooms = rooms.map((room) => {
            // Lọc và lấy ra mảng profiles chuẩn
            const members = room.room_members
                .map((rm: any) => rm.profiles)
                .filter(Boolean); // Lọc bỏ các trường hợp null (nếu có)

            // Xóa trường room_members gốc đi cho JSON trả về gọn gàng
            delete room.room_members;

            return {
                ...room,
                members: members,
                member_count: members.length, // Trả về luôn số lượng để render UI "120 đang nghe"
            };
        });

        return NextResponse.json({ data: formattedRooms }, { status: 200 });

    } catch (error: any) {
        console.error("API Get Rooms Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}