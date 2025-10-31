import React from 'react';

const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm-4-6c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-gray-800/50">
      <div className="container mx-auto flex items-center justify-center">
        <CameraIcon className="w-8 h-8 mr-3 text-brand-light" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-light text-transparent bg-clip-text">
          Hidalgo Photo AI Suite
        </h1>
      </div>
    </header>
  );
};
