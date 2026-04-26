export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  releaseDate: string;
  previewUrl: string;
  imageUrl: string;
  appleMusicId: string;
  fileType: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  history: string[];
  likedGenres: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  songIds: string[];
  imageUrl?: string;
}
