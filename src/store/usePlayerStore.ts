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
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  seekTo: number | null;
  // Actions
  setCurrentTrack: (track: Track, autoPlay?: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (current: number, total: number) => void;
  setSeekTo: (time: number | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  duration: 0,
  currentTime: 0,
  seekTo: null,

  setCurrentTrack: (track, autoPlay = true) => set({ currentTrack: track, isPlaying: autoPlay }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (current, total) => set({ currentTime: current, duration: total }),
  setSeekTo: (time) => set({ seekTo: time }),
}));