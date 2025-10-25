
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as?: 'input' | 'textarea';
};

export const Input: React.FC<InputProps> = ({ as = 'input', className, ...props }) => {
  const baseClasses = "w-full bg-gray-700/50 text-gray-200 border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition";
  
  const combinedClasses = `${baseClasses} ${className}`;

  if (as === 'textarea') {
    return <textarea className={combinedClasses} {...props} />;
  }
  
  return <input className={combinedClasses} {...props} />;
};
