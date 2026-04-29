import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  lyrics?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  seekTo: number | null;
  index: number;       // Vị trí bài hiện tại trong queue
  isAutoplay: boolean; // Trạng thái bật/tắt tự động tìm bài tương tự
  isLooping: boolean;  // Trạng thái lặp bài hiện tại
  isShuffled: boolean; // Trạng thái trộn bài
  isZoomed: boolean;   // Trạng thái hiển thị giao diện Music Zoom

  mode: 'private' | 'room';
  roomId: string | null;

  // Actions
  setCurrentTrack: (track: Track, autoPlay?: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (current: number, total: number) => void;
  setSeekTo: (time: number | null) => void;
  addToQueue: (queue: Track[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  fetchRelatedYouTubeTrack: (videoId: string) => Promise<Track | null>;
  setMode: (mode: 'private' | 'room', roomId?: string | null) => void;
  syncRoomState: (data: Partial<PlayerState>) => void; // Hàm nhận lệnh từ Socket
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setZoom: (isZoomed: boolean) => void;
  toggleZoom: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  duration: 0,
  currentTime: 0,
  seekTo: null,
  queue: [],
  index: 0,
  isAutoplay: true,
  isLooping: false,
  isShuffled: false,
  isZoomed: false,

  mode: 'private',
  roomId: null,

  setCurrentTrack: (track, autoPlay = true) => set({ currentTrack: track, isPlaying: autoPlay }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (current, total) => set({ currentTime: current, duration: total }),
  setSeekTo: (time) => set({ seekTo: time }),
  addToQueue: (tracks) => set((state) => ({ queue: [...state.queue, ...tracks] })),
  nextTrack: () => set((state) => {
    const next = state.queue[0];
    if (!next) return { isPlaying: false };
    return { currentTrack: next, queue: state.queue.slice(1) };
  }),
  prevTrack: () => set((state) => {
    const prev = state.queue[state.queue.length - 1];
    if (!prev) return { isPlaying: false };
    return { currentTrack: prev, queue: state.queue.slice(0, -1) };
  }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  toggleShuffle: () => set((state) => {
    const newShuffled = !state.isShuffled;
    if (newShuffled && state.queue.length > 0) {
      const shuffled = [...state.queue];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return { isShuffled: true, queue: shuffled };
    }
    return { isShuffled: newShuffled };
  }),
  setZoom: (isZoomed) => set({ isZoomed }),
  toggleZoom: () => set((state) => ({ isZoomed: !state.isZoomed })),
  fetchRelatedYouTubeTrack: async (videoId: string) => {
    try {
      const res = await fetch(`/api/youtube/related?videoId=${videoId}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.items || data.items.length === 0) return null;

      const item = data.items[0];
      const nextVideoId = typeof item.id === 'string' ? item.id : item.id.videoId;
      const snippet = item.snippet;

      return {
        id: nextVideoId,
        title: snippet.title,
        artist: snippet.channelTitle,
        thumbnail: snippet.thumbnails.high.url,
      };
    } catch (error) {
      console.error("Error fetching related track:", error);
      return null;
    }
  },
  setMode: (mode, roomId = null) => {
    set({
      mode,
      roomId,
      // Optional: Nếu vào phòng online, tắt autoplay nội bộ đi để Server quyết định
      isAutoplay: mode === 'room' ? false : true
    });
  },

  // 3. HÀM ĐỒNG BỘ TỪ SERVER
  // Bất cứ khi nào Socket nhận được tin nhắn từ Server, ta ném data vào hàm này
  syncRoomState: (data) => set((state) => ({ ...state, ...data })),
}));