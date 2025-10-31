import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-2xl text-center p-8 animate-fade-in">
      <h2 className="text-3xl font-semibold mb-4 text-gray-200">Transforma tu Foto con IA</h2>
      <p className="text-gray-400 mb-8">Sube una imagen y descríbela con un estilo único. Arrastra y suelta una imagen o haz clic para seleccionar un archivo.</p>
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex justify-center items-center w-full h-64 px-6 transition-all duration-300 bg-gray-800 border-2 border-dashed rounded-lg cursor-pointer ${isDragging ? 'border-brand-primary scale-105 bg-gray-700' : 'border-gray-600 hover:border-brand-light'}`}
      >
        <div className="flex flex-col items-center">
          <UploadIcon className={`w-12 h-12 mb-3 transition-colors duration-300 ${isDragging ? 'text-brand-primary' : 'text-gray-500'}`} />
          <span className="font-semibold text-lg text-gray-300">
            {isDragging ? 'Suelta la imagen aquí' : 'Haz clic para subir o arrastra y suelta'}
          </span>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, o WEBP</p>
        </div>
        <input type="file" id="file-upload" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </label>
    </div>
  );
};
