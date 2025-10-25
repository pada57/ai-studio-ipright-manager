
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 shadow-lg">
      <div className="border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
