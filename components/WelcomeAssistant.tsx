import React from 'react';
import { CreateIcon, RestoreIcon, BackgroundIcon } from './Icons';

interface WelcomeAssistantProps {
  show: boolean;
  onClose: () => void;
}

const ToolCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="text-brand-light flex-shrink-0 mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-100">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

export const WelcomeAssistant: React.FC<WelcomeAssistantProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl w-full max-w-2xl transform animate-slide-in">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100">¡Bienvenido a Hidalgo Photo AI Suite!</h2>
            <p className="mt-2 text-gray-400">Tu estudio fotográfico de IA todo en uno. Aquí tienes una guía rápida:</p>
          </div>
          <div className="mt-8 space-y-4">
            <ToolCard 
                icon={<CreateIcon />} 
                title="Crear" 
                description="Transforma tu foto con estilos artísticos. Describe tu visión y deja que la IA la haga realidad." 
            />
            <ToolCard 
                icon={<RestoreIcon />} 
                title="Restaurar" 
                description="Repara fotos antiguas o dañadas. Mejora la nitidez, corrige colores y elimina imperfecciones con un solo clic." 
            />
            <ToolCard 
                icon={<BackgroundIcon />} 
                title="Editar Fondo" 
                description="Cambia el escenario. Describe un nuevo fondo y la IA colocará al sujeto de tu foto en él de forma realista." 
            />
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-800/50 border-t border-gray-700/50 text-center">
           <button 
                onClick={onClose}
                className="px-8 py-2 font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
                ¡Entendido, a crear!
            </button>
        </div>
      </div>
    </div>
  );
};
