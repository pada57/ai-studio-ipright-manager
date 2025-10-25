
import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  const baseClasses = "w-full bg-gray-700/50 text-gray-200 border border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition";

  return (
    <select className={`${baseClasses} ${className}`} {...props}>
      {children}
    </select>
  );
};
