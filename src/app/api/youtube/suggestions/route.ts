import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) return NextResponse.json([]);

    try {
        // Gọi API Autocomplete của Google (Không cần API Key, không tốn Quota)
        const response = await axios.get('https://suggestqueries.google.com/complete/search', {
            params: {
                client: 'firefox', // Ép trả về định dạng JSON dễ đọc
                ds: 'yt',          // ds = Data Source, 'yt' nghĩa là lấy gợi ý của YouTube
                q: query,
                ie: 'UTF-8',
                oe: 'UTF-8'
            },
        });

        // Kết quả trả về của API này là một mảng có dạng:
        // [ "từ khóa bạn gõ", ["gợi ý 1", "gợi ý 2", "gợi ý 3", ...] ]
        // Nên chúng ta sẽ lấy mảng ở vị trí index số 1
        const rawSuggestions = response.data[1] || [];

        // Vì đây chỉ là từ khóa (text), nó sẽ KHÔNG CÓ id, artist hay thumbnail.
        // Ta map lại thành mảng object chứa 'title' để Frontend của bạn ít phải sửa code nhất.
        const suggestions = rawSuggestions.map((text: string, index: number) => ({
            id: `suggest-${index}`, // Tạo ID tạm để làm key cho React map
            title: text,
        }));

        return NextResponse.json(suggestions, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600', // Cache từ khóa trong 1 tiếng
            }
        });
    } catch (error) {
        console.error("Lỗi lấy gợi ý từ khóa:", error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}

// export async function GET(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const query = searchParams.get('q');

//     if (!query) return NextResponse.json([]);

//     try {
//         const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//             params: {
//                 part: 'snippet',
//                 q: query,
//                 type: 'video',
//                 videoCategoryId: '10',
//                 maxResults: 5,
//                 key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
//             },
//         });

//         const suggestions = response.data.items.map((item: any) => ({
//             id: item.id.videoId,
//             title: item.snippet.title,
//             artist: item.snippet.channelTitle,
//             thumbnail: item.snippet.thumbnails.default.url, // Dùng ảnh nhỏ cho nhẹ
//         }));

//         return NextResponse.json(suggestions, {
//             headers: {
//                 'Cache-Control': 'public, s-maxage=1800', // Cache gợi ý trong 30 phút
//             }
//         });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
//     }
// }