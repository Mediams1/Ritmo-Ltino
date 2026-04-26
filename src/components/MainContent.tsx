import React, { useEffect, useState } from 'react';
import { db, auth, googleProvider } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Song, UserProfile } from '../types';
import { useAuth, usePlayer } from '../context/AppContext';
import { Play, LogIn, LogOut, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithPopup, signOut } from 'firebase/auth';

import { format } from 'date-fns';

export const MainContent: React.FC = () => {
  const { user, profile } = useAuth();
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const q = query(collection(db, 'songs'), limit(100));
        const snap = await getDocs(q);
        setSongs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Song)));
      } catch (error) {
        console.error("Error loading songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = async (song: Song) => {
    playSong(song, songs);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        history: arrayUnion(song.id),
        likedGenres: arrayUnion(song.genre)
      });
    }
  };

  const genres = Array.from(new Set(songs.map(s => s.genre)));

  const recommendedSongs = songs.filter(s => 
    profile?.likedGenres?.includes(s.genre) && !profile?.history?.includes(s.id)
  ).slice(0, 6);

  if (loading) return <div className="flex-1 flex items-center justify-center bg-spotify-black text-white font-bold">Cargando ritmo latino...</div>;

  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-b from-[#222] to-spotify-black flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs hover:bg-black/80 transition-colors"><ChevronLeft size={18} /></button>
            <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs opacity-50"><ChevronRight size={18} /></button>
          </div>
          <div className="flex bg-spotify-elevated rounded-full px-4 py-2 w-80 group border border-transparent focus-within:border-white/20 transition-all">
            <Search className="text-spotify-light-gray mr-2" size={18} />
            <input type="text" placeholder="¿Qué quieres escuchar?" className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 bg-black/60 hover:bg-black/80 rounded-full pr-4 pl-1 py-1 group cursor-pointer border border-white/5 transition-colors" onClick={() => signOut(auth)}>
              {user.photoURL ? (
                <img src={user.photoURL} className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center"><User size={14} /></div>
              )}
              <span className="text-sm font-semibold">{user.displayName || 'Usuario'}</span>
              <LogOut size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <>
              <button className="text-spotify-light-gray font-bold hover:text-white transition-colors text-sm">Registrarse</button>
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform text-sm"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 p-6 space-y-10 overflow-y-auto custom-scrollbar pb-32">
        {user && recommendedSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer">Recomendadas basado en tu historial</h2>
              <span className="text-spotify-light-gray text-xs font-bold uppercase cursor-pointer hover:underline">Ver todo</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
              {recommendedSongs.map(song => (
                <SongCard key={song.id} song={song} onPlay={() => handlePlay(song)} />
              ))}
            </div>
          </section>
        )}

        {genres.map(genre => (
          <section key={genre}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer">{genre}</h2>
              <span className="text-spotify-light-gray text-xs font-bold uppercase cursor-pointer hover:underline">Ver todo</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
              {songs.filter(s => s.genre === genre).map(song => (
                <SongCard key={song.id} song={song} onPlay={() => handlePlay(song)} />
              ))}
            </div>
          </section>
        ))}

        {/* Admin Section - Metadata Table */}
        <section className="bg-black/20 rounded-xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-spotify-light-gray">Panel de Administración (Metadatos del Catálogo)</h3>
          </div>
          <div className="text-xs text-spotify-light-gray overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[30px_1fr_120px_120px_80px_80px] gap-4 pb-3 border-b border-white/10 font-bold uppercase tracking-tighter">
                <span>#</span>
                <span>Título / Artista</span>
                <span>Género</span>
                <span>Lanzamiento</span>
                <span>Duración</span>
                <span>Formato</span>
              </div>
              <div className="mt-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {songs.map((song, i) => (
                  <div key={song.id} className="grid grid-cols-[30px_1fr_120px_120px_80px_80px] gap-4 py-2 border-b border-white/5 hover:bg-white/5 rounded px-2 items-center transition-colors group">
                    <span className="group-hover:text-white transition-colors">{i + 1}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium truncate">{song.title}</span>
                      <span className="text-[10px] text-spotify-light-gray truncate">{song.artist}</span>
                    </div>
                    <div>
                      <span className="bg-spotify-green/20 text-spotify-green px-2 py-0.5 rounded-full border border-spotify-green/30 text-[10px] inline-block font-bold">
                        {song.genre}
                      </span>
                    </div>
                    <span>{song.releaseDate ? format(new Date(song.releaseDate), 'dd/MM/yyyy') : '---'}</span>
                    <span>{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</span>
                    <span className="uppercase text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-white tracking-widest">{song.fileType?.split('/')[1] || 'AAC'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const SongCard: React.FC<{ song: Song, onPlay: () => void }> = ({ song, onPlay }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="group bg-spotify-gray hover:bg-spotify-elevated p-4 rounded-lg transition-all cursor-pointer border border-transparent hover:border-white/10"
    onClick={onPlay}
  >
    <div className="relative aspect-square mb-4 shadow-2xl">
      <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover rounded-md bg-spotify-elevated" />
      <button 
        onClick={(e) => { e.stopPropagation(); onPlay(); }}
        className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105"
      >
        <Play size={24} className="fill-current" />
      </button>
    </div>
    <h3 className="font-bold text-sm truncate text-white">{song.title}</h3>
    <p className="text-xs text-spotify-light-gray mt-1 truncate">{song.artist}</p>
  </motion.div>
);
