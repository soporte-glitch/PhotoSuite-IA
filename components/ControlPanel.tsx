import React from 'react';
import { ActionButton } from './ActionButton';
import { stylePrompts } from '../constants/prompts';
import { Tool } from '../App';
import { CreateIcon, RestoreIcon, BackgroundIcon, MagicWandIcon } from './Icons';

interface ControlPanelProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (value: string) => void;
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
  backgroundPrompt: string;
  onBackgroundPromptChange: (value: string) => void;
  onGenerate: () => void;
  onInspire: () => void;
  isLoading: boolean;
}

const StyleButton: React.FC<{ label: string; onClick: () => void; isSelected: boolean }> = ({ label, onClick, isSelected }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 border-2 border-transparent ${
      isSelected
        ? 'bg-brand-primary text-white shadow-lg scale-105 gamer-button-active'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-brand-light'
    }`}
  >
    {label}
  </button>
);

const ToolButton: React.FC<{ label: string, icon: React.ReactNode, onClick: () => void, isActive: boolean }> = ({ label, icon, onClick, isActive }) => (
    <button onClick={onClick} className={`flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-lg transition-all duration-200 border-2 ${isActive ? 'bg-brand-primary/20 border-brand-light text-brand-light' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/70 hover:border-brand-secondary'}`}>
        {icon}
        <span className="text-xs font-bold tracking-wider uppercase">{label}</span>
    </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const getButtonText = () => {
    if (props.isLoading) {
        switch(props.activeTool) {
            case 'create': return 'Creando...';
            case 'restore': return 'Restaurando...';
            case 'background': return 'Editando...';
        }
    }
    switch(props.activeTool) {
        case 'create': return 'Generar';
        case 'restore': return 'Restaurar';
        case 'background': return 'Cambiar Fondo';
    }
  }
    
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-2xl w-full animate-slide-in flex flex-col gap-6 backdrop-blur-sm border border-gray-700/50">
      {/* TOOLBOX */}
      <div>
        <h3 className="text-center mb-4 font-semibold text-gray-400 tracking-widest text-sm uppercase">Caja de Herramientas</h3>
        <div className="flex items-center justify-center gap-2">
            <ToolButton label="Crear" icon={<CreateIcon />} onClick={() => props.setActiveTool('create')} isActive={props.activeTool === 'create'} />
            <ToolButton label="Restaurar" icon={<RestoreIcon />} onClick={() => props.setActiveTool('restore')} isActive={props.activeTool === 'restore'} />
            <ToolButton label="Fondo" icon={<BackgroundIcon />} onClick={() => props.setActiveTool('background')} isActive={props.activeTool === 'background'} />
        </div>
      </div>
      
      <hr className="border-gray-700" />
      
      {/* DYNAMIC CONTROLS */}
      <div className="flex flex-col gap-6">
        {props.activeTool === 'create' && (
            <>
                <div className="animate-fade-in">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Instrucciones (Prompt)</label>
                    <div className="relative">
                        <textarea id="prompt" value={props.prompt} onChange={(e) => props.onPromptChange(e.target.value)} placeholder="Ej: Un dragón majestuoso..." rows={4} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition" />
                        <button onClick={props.onInspire} title="Inspírame" className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-brand-secondary rounded-full text-gray-300 hover:text-white transition-colors">
                            <MagicWandIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="animate-fade-in">
                    <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt Negativo (¿Qué evitar?)</label>
                    <textarea id="negative-prompt" value={props.negativePrompt} onChange={(e) => props.onNegativePromptChange(e.target.value)} placeholder="Ej: mala calidad, borroso..." rows={2} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition" />
                </div>
                <div className="animate-fade-in">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Estilos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(stylePrompts).map(([key, _]) => (
                            <StyleButton key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} onClick={() => props.onStyleSelect(key)} isSelected={props.selectedStyle === key} />
                        ))}
                    </div>
                </div>
            </>
        )}

        {props.activeTool === 'restore' && (
            <div className="text-center p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                <RestoreIcon className="w-10 h-10 mx-auto text-brand-light mb-3" />
                <h4 className="font-bold text-lg text-gray-200">Restauración Automática</h4>
                <p className="text-sm text-gray-400 mt-2">Esta herramienta reparará automáticamente daños, mejorará la nitidez y corregirá los colores de tu foto. ¡Solo haz clic en Restaurar!</p>
            </div>
        )}

        {props.activeTool === 'background' && (
            <div className="animate-fade-in">
                <label htmlFor="background-prompt" className="block text-sm font-medium text-gray-300 mb-2">Describe el Nuevo Fondo</label>
                <textarea id="background-prompt" value={props.backgroundPrompt} onChange={(e) => props.onBackgroundPromptChange(e.target.value)} placeholder="Ej: un bosque encantado al atardecer, una ciudad futurista de noche, una playa tropical..." rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition" />
                <p className="text-xs text-gray-500 mt-2">La IA identificará al sujeto principal y lo colocará en el nuevo entorno que describas.</p>
            </div>
        )}
      </div>

      <ActionButton
        onClick={props.onGenerate}
        disabled={props.isLoading || (props.activeTool === 'background' && !props.backgroundPrompt.trim())}
        className="w-full bg-brand-primary hover:bg-brand-secondary mt-4 gamer-button"
      >
        {getButtonText()}
      </ActionButton>
    </div>
  );
};
