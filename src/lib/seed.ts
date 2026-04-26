import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { searchAppleMusic, LATIN_GENRES } from './appleMusic';

export async function seedDatabase() {
  const songsCol = collection(db, 'songs');
  const snap = await getDocs(songsCol);
  
  if (snap.size > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');
  for (const genre of LATIN_GENRES) {
    const songs = await searchAppleMusic(genre, 3);
    for (const song of songs) {
      try {
        await addDoc(songsCol, song);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'songs');
      }
    }
  }
  console.log('Seeding complete!');
}
