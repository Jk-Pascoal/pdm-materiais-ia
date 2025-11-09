import React from 'react';
import { WandIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-md w-full h-16 flex items-center px-6 text-white z-20">
      <div className="flex items-center">
        <WandIcon className="w-8 h-8 mr-3 text-brand-secondary" />
        <h1 className="text-2xl font-bold tracking-tight">
          Padronizador de Descrição{' '}
          <span className="font-light text-gray-200">PDM & DAMA</span>
        </h1>
      </div>
      <div className="ml-auto text-sm text-gray-300">
        ISO 8000 | DAMA-DMBOK
      </div>
    </header>
  );
};

export default Header;