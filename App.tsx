import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { ActionButton } from './components/ActionButton';
import { ControlPanel } from './components/ControlPanel';
import { WelcomeAssistant } from './components/WelcomeAssistant';
import { generateImage, restoreImage, changeBackgroundImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { inspirationPrompts } from './constants/prompts';

export type Tool = 'create' | 'restore' | 'background';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // State for controls
  const [activeTool, setActiveTool] = useState<Tool>('create');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');

  const handleImageUpload = (file: File) => {
    setOriginalFile(file);
    const objectURL = URL.createObjectURL(file);
    setOriginalImage(objectURL);
    setGeneratedImage(null);
    setError(null);
    setPrompt('');
    setNegativePrompt('');
    setBackgroundPrompt('');
    setShowWelcome(false); // Hide welcome assistant on upload
  };

  const handleGenerate = useCallback(async () => {
    if (!originalFile) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null); // Clear previous generation
    
    try {
      const { base64, mimeType } = await fileToBase64(originalFile);
      let generatedBase64: string;

      switch (activeTool) {
        case 'create':
          generatedBase64 = await generateImage(base64, mimeType, {
            prompt,
            style: selectedStyle,
            negativePrompt,
          });
          break;
        case 'restore':
          generatedBase64 = await restoreImage(base64, mimeType);
          break;
        case 'background':
          generatedBase64 = await changeBackgroundImage(base64, mimeType, backgroundPrompt);
          break;
        default:
          throw new Error('Herramienta no válida seleccionada');
      }
      
      setGeneratedImage(`data:image/png;base64,${generatedBase64}`);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Un error desconocido ocurrió.';
      setError(`No se pudo procesar la imagen. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, activeTool, prompt, selectedStyle, negativePrompt, backgroundPrompt]);

  const handleReset = () => {
    if (originalImage) {
        URL.revokeObjectURL(originalImage);
    }
    setOriginalImage(null);
    setGeneratedImage(null);
    setOriginalFile(null);
    setIsLoading(false);
    setError(null);
    setPrompt('');
    setNegativePrompt('');
    setSelectedStyle('cinematic');
    setBackgroundPrompt('');
    setActiveTool('create');
    setShowWelcome(true);
  };

  const handleInspire = () => {
    const randomIndex = Math.floor(Math.random() * inspirationPrompts.length);
    setPrompt(inspirationPrompts[randomIndex]);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        {!originalImage ? (
          <>
            <WelcomeAssistant show={showWelcome} onClose={() => setShowWelcome(false)} />
            <ImageUploader onImageUpload={handleImageUpload} />
          </>
        ) : (
          <div className="w-full max-w-7xl flex flex-col items-center animate-fade-in">
            <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-8">
              <div className="flex-grow w-full lg:w-2/3 flex flex-col">
                 <ImageDisplay 
                    originalImage={originalImage} 
                    enhancedImage={generatedImage} 
                    isLoading={isLoading}
                  />
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    {generatedImage && (
                      <a
                        href={generatedImage}
                        download={`generada-${originalFile?.name || 'image.png'}`}
                        className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 duration-300 animate-slide-in"
                      >
                        Descargar Imagen
                      </a>
                    )}
                    <ActionButton 
                      onClick={handleReset}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Empezar de Nuevo
                    </ActionButton>
                  </div>
              </div>
              <div className="w-full lg:w-1/3 flex-shrink-0">
                  <ControlPanel
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    prompt={prompt}
                    onPromptChange={setPrompt}
                    negativePrompt={negativePrompt}
                    onNegativePromptChange={setNegativePrompt}
                    selectedStyle={selectedStyle}
                    onStyleSelect={setSelectedStyle}
                    backgroundPrompt={backgroundPrompt}
                    onBackgroundPromptChange={setBackgroundPrompt}
                    onGenerate={handleGenerate}
                    onInspire={handleInspire}
                    isLoading={isLoading}
                  />
              </div>
            </div>
            
            {error && (
              <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-lg animate-fade-in w-full max-w-3xl text-center">
                <p>{error}</p>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Hidalgo Photo AI Suite - Desarrollado con Gemini</p>
      </footer>
    </div>
  );
};

export default App;
