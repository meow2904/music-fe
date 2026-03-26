import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) return NextResponse.json([]);

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                videoCategoryId: '10',
                maxResults: 5,
                key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
            },
        });

        const suggestions = response.data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url, // Dùng ảnh nhỏ cho nhẹ
        }));

        return NextResponse.json(suggestions, {
            headers: {
                'Cache-Control': 'public, s-maxage=1800', // Cache gợi ý trong 30 phút
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}