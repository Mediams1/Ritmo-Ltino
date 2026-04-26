/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider } from './context/AppContext';
import { PlayerProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Player } from './components/Player';
import { useEffect } from 'react';
import { seedDatabase } from './lib/seed';

export default function App() {
  useEffect(() => {
    // Initial data seed
    seedDatabase();
  }, []);

  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MainContent />
          </div>
          <Player />
        </div>
      </PlayerProvider>
    </AuthProvider>
  );
}
