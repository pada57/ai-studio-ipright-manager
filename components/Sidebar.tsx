
import React from 'react';
// FIX: Corrected import path for types.
import type { IpType } from '../types';
// FIX: Corrected import path for constants.
import { COUNTRIES, IP_TYPES } from '../constants';
import { Select } from './common/Select';

interface SidebarProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedIpType: IpType | null;
  setSelectedIpType: (ipType: IpType) => void;
}

const Logo: React.FC = () => (
    <div className="flex items-center space-x-3 px-4 mb-6">
      <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M12 11.13V22"></path>
        <path d="m19.34 7.6-14.7 6.82"></path>
      </svg>
      <h1 className="text-xl font-bold text-gray-100">IP Law Engine</h1>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedIpType,
  setSelectedIpType,
}) => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <Logo />

      <div className="mb-6 px-2">
        <label htmlFor="country-select" className="text-sm font-medium text-gray-400 mb-2 block">Country</label>
        <Select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </Select>
      </div>

      <nav className="flex-1 space-y-1 pr-2">
        <h2 className="px-2 text-sm font-semibold text-gray-400 mb-2">IP Right Type</h2>
        {IP_TYPES.map((ipType) => (
          <button
            key={ipType}
            onClick={() => setSelectedIpType(ipType)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center
              ${selectedIpType === ipType 
                ? 'bg-blue-600/20 text-blue-300 font-semibold' 
                : 'text-gray-300 hover:bg-gray-700/50'
              }`}
          >
             <span className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedIpType === ipType ? 'bg-blue-400' : 'bg-gray-500'}`}></span>
            {ipType}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-2 text-center text-xs text-gray-500">
        <p>&copy; 2024 IP Management Inc.</p>
      </div>
    </aside>
  );
};
