
import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-8 py-4 font-bold text-lg text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
