'use client';
import YouTube from 'react-youtube';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useEffect, useRef } from 'react';

const YOUTUBE_OPTS = { height: '0', width: '0', playerVars: { autoplay: 0, controls: 0 } };

export const AudioEngine = () => {
    const currentTrack = usePlayerStore(state => state.currentTrack);
    const isPlaying = usePlayerStore(state => state.isPlaying);
    const volume = usePlayerStore(state => state.volume);
    const setPlaying = usePlayerStore(state => state.setPlaying);
    const setProgress = usePlayerStore(state => state.setProgress);

    const seekTo = usePlayerStore(state => state.seekTo);
    const setSeekTo = usePlayerStore(state => state.setSeekTo);

    const playerRef = useRef<any>(null);

    const queue = usePlayerStore(state => state.queue);
    const index = usePlayerStore(state => state.index);
    const isAutoplay = usePlayerStore(state => state.isAutoplay);
    const playNext = usePlayerStore(state => state.nextTrack);
    const addToQueue = usePlayerStore(state => state.addToQueue);
    const fetchRelatedYouTubeTrack = usePlayerStore(state => state.fetchRelatedYouTubeTrack);

    // Đồng bộ âm lượng và trạng thái Play/Pause từ Store xuống YouTube Player
    useEffect(() => {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
        playerRef.current.setVolume(volume);
    }, [isPlaying, volume, currentTrack?.id]);

    // Đồng bộ chức năng tua nhạc (Seek)
    useEffect(() => {
        if (seekTo !== null && playerRef.current) {
            playerRef.current.seekTo(seekTo, true);
            setSeekTo(null); // Reset lại ngay lập tức để không bị lặp
        }
    }, [seekTo, setSeekTo]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const onReady = (event: any) => {
        playerRef.current = event.target;
        playerRef.current.setVolume(volume);
        if (isPlaying) playerRef.current.playVideo();
    };

    const onStateChange = async (event: any) => {
        // 1: Playing, 2: Paused, 0: Ended, 3: Buffering
        if (event.data === 1) {
            setPlaying(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                    setProgress(playerRef.current.getCurrentTime(), playerRef.current.getDuration());
                }
            }, 1000);
        } else if (event.data === 2) {
            setPlaying(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } else if (event.data === 0) {
            // event.data === 0 là trạng thái bài hát kết thúc (Ended)
            if (event.data === 0) {
                if (queue.length > 0 && queue.length > index) {
                    playNext(); // Phát bài tiếp theo có sẵn trong danh sách
                } else if (isAutoplay && currentTrack) {
                    // Logic tự động tìm bài tương tự
                    const nextRelatedTrack = await fetchRelatedYouTubeTrack(currentTrack.id);
                    if (nextRelatedTrack) {
                        addToQueue([nextRelatedTrack]);
                        playNext();
                    }
                }
            }
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    if (!currentTrack?.id) return null;

    return (
        <div className="hidden pointer-events-none overflow-hidden absolute w-0 h-0">
            <YouTube
                videoId={currentTrack.id}
                opts={YOUTUBE_OPTS}
                onReady={onReady}
                onStateChange={onStateChange}
            />
        </div>
    );
};