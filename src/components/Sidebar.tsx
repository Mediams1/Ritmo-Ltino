import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Music2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...args: any[]) => twMerge(clsx(args));

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-black p-2 flex flex-col space-y-2 h-full">
      <nav className="bg-spotify-black rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2 text-spotify-green mb-2">
           <Music2 className="w-8 h-8" />
           <span className="text-xl font-bold tracking-tight text-white">Ritmo Latino</span>
        </div>
        <NavItem icon={<Home size={22} />} label="Inicio" active />
        <NavItem icon={<Search size={22} />} label="Buscar" />
      </nav>

      <div className="flex-1 bg-spotify-black rounded-lg p-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between text-spotify-light-gray mb-4">
          <div className="flex items-center space-x-2">
            <Library size={22} />
            <span className="font-bold text-sm">Tu biblioteca</span>
          </div>
          <PlusSquare size={20} className="cursor-pointer hover:text-white transition-colors" />
        </div>
        
        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
          <div className="p-4 bg-spotify-elevated rounded-lg shadow-md">
            <p className="font-bold text-sm">Crea tu primera lista</p>
            <p className="text-xs text-spotify-light-gray mt-1 mb-3">Es muy fácil, te echaremos una mano.</p>
            <button className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs hover:scale-105 transition-transform">
              Crear lista
            </button>
          </div>
          
          <div className="flex flex-col space-y-2 opacity-60">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#555] mt-4">Estadísticas del sistema</p>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Catálogo Apple Music Live</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>10 Géneros latinos</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {['Vibra Reggaetón', 'Clásicos de Salsa', 'Bachata 2024', 'Rock Latam', 'Trap Latino Mix'].map(name => (
              <p key={name} className="text-spotify-light-gray hover:text-white cursor-pointer text-sm truncate transition-colors">
                {name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <div className={cn(
    "flex items-center space-x-4 cursor-pointer transition-colors group",
    active ? "text-white" : "text-spotify-light-gray hover:text-white"
  )}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </div>
);
