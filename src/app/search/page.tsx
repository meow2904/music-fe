import { VideoGridList } from '@/components/ui/VideoGridList';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> | any }) {
    // Await searchParams to support Next.js 15 where searchParams is a Promise
    const resolvedParams = await searchParams;
    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

    return (
        <VideoGridList query={query} />
    );
}