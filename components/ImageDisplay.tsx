import React from 'react';
import { Loader } from './Loader';

interface ImageDisplayProps {
  originalImage: string;
  enhancedImage: string | null;
  isLoading: boolean;
}

const ImageCard: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode; isLoading?: boolean }> = ({ title, imageUrl, children, isLoading }) => (
  <div className="flex-1 min-w-[280px] w-full animate-slide-in">
    <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
    <div className="relative aspect-square bg-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
      {isLoading ? (
        <Loader message="La IA está creando tu imagen..." />
      ) : imageUrl ? (
        <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
      ) : (
        <div className="text-gray-500 p-8 text-center">Tu imagen transformada aparecerá aquí.</div>
      )}
      {children}
    </div>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, enhancedImage, isLoading }) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <ImageCard title="Original" imageUrl={originalImage} />
      <ImageCard title="Generada" imageUrl={enhancedImage} isLoading={isLoading} />
    </div>
  );
};
