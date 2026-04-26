import { Song } from '../types';

export const LATIN_GENRES = [
  'Reggaeton',
  'Salsa',
  'Bachata',
  'Latin Pop',
  'Trap Latino',
  'Regional Mexicano',
  'Merengue',
  'Rock en Español',
  'Bossa Nova',
  'Urban Latin'
];

export async function searchAppleMusic(genre: string, limit = 3): Promise<Partial<Song>[]> {
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(genre)}&media=music&limit=${limit}&country=US`);
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      title: item.trackName,
      artist: item.artistName,
      genre: genre,
      duration: Math.floor(item.trackTimeMillis / 1000),
      releaseDate: item.releaseDate,
      previewUrl: item.previewUrl,
      imageUrl: item.artworkUrl100.replace('100x100', '600x600'),
      appleMusicId: String(item.trackId),
      fileType: 'audio/mpeg'
    }));
  } catch (error) {
    console.error('Error searching Apple Music:', error);
    return [];
  }
}
