import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2 } from 'lucide-react';
import { usePlayer } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const Player: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = usePlayer();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p < 100 ? p + 0.3 : 0));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  return (
    <footer className="h-[90px] bg-black border-t border-white/10 px-4 flex items-center justify-between">
      <div className="flex items-center w-[30%]">
        <div className="relative group">
          <img src={currentSong.imageUrl} alt={currentSong.title} className="w-14 h-14 rounded shadow-lg mr-3" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium hover:underline cursor-pointer truncate text-white">{currentSong.title}</span>
          <span className="text-[10px] text-spotify-light-gray hover:underline cursor-pointer truncate">{currentSong.artist}</span>
        </div>
        <Heart size={16} className="ml-6 text-spotify-light-gray hover:text-white cursor-pointer transition-colors" />
      </div>

      <div className="flex flex-col items-center w-[40%] space-y-2">
        <div className="flex items-center space-x-6">
          <Shuffle size={16} className="text-spotify-light-gray hover:text-white cursor-pointer transition-colors" />
          <SkipBack size={20} onClick={prevSong} className="text-spotify-light-gray hover:text-white cursor-pointer fill-current transition-colors" />
          <button 
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="ml-0.5 fill-current" />}
          </button>
          <SkipForward size={20} onClick={nextSong} className="text-spotify-light-gray hover:text-white cursor-pointer fill-current transition-colors" />
          <Repeat size={16} className="text-spotify-light-gray hover:text-white cursor-pointer transition-colors" />
        </div>
        
        <div className="flex items-center space-x-2 w-full">
          <span className="text-[10px] text-spotify-light-gray font-mono">0:12</span>
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative overflow-hidden">
            <div className="h-full bg-white group-hover:bg-spotify-green rounded-full transition-colors" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] text-spotify-light-gray font-mono">0:30</span>
        </div>
      </div>

      <div className="flex items-center justify-end w-[30%] space-x-3 text-spotify-light-gray">
        <Maximize2 size={16} className="hover:text-white cursor-pointer transition-colors" />
        <div className="flex items-center space-x-2 w-32">
          <Volume2 size={16} />
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer overflow-hidden">
             <div className="h-full bg-white group-hover:bg-spotify-green rounded-full w-2/3 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
