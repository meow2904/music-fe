// app/api/youtube/search/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    // 1. Lấy query từ URL (ví dụ: /api/youtube/search?q=son-tung)
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'video';
    const pageToken = searchParams.get('pageToken');

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        // 2. Gọi YouTube API từ phía SERVER (Bảo mật tuyệt đối Key)
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: type,
                videoCategoryId: '10', // Chỉ lấy nhạc
                maxResults: 12,
                pageToken: pageToken,
                key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY, // Key này chỉ nằm ở Server
            },
        });

        // 3. Trả kết quả về cho Client
        return NextResponse.json(
            {
                items: response.data.items,
                nextPageToken: response.data.nextPageToken,
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
                },
            });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch YouTube' }, { status: 500 });
    }
}