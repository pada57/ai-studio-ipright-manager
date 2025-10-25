import React, { useMemo } from 'react';
import type { IpRight, Rule, SortConfig } from '../types';
import { findMatchingRuleAndPlan } from '../services/lawEngine';
import { ExecutionPlanTooltip } from './ExecutionPlan';

interface IpRightTableProps {
  ipRights: IpRight[];
  rules: Rule[];
  selectedIpRightId: string | null;
  onSelect: (ipRight: IpRight) => void;
  onOpenDetail: (ipRight: IpRight) => void;
  onEdit: (ipRight: IpRight) => void;
  onDelete: (ipRightId: string) => void;
  sortConfig: SortConfig<IpRight>;
  onSort: (key: keyof Pick<IpRight, 'name' | 'ipType'>) => void;
}

const MatchingRuleCell: React.FC<{ ipRight: IpRight, rules: Rule[] }> = ({ ipRight, rules }) => {
    const match = useMemo(() => findMatchingRuleAndPlan(ipRight, rules), [ipRight, rules]);

    if (!match) {
        return <span className="text-gray-500 text-xs">No Match</span>;
    }

    return (
        <ExecutionPlanTooltip plan={match.plan}>
            <span className="font-mono bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-xs cursor-help">
                {match.rule.id.slice(0, 8)}...
            </span>
        </ExecutionPlanTooltip>
    );
};

const SortableHeader: React.FC<{
  title: string;
  sortKey: keyof IpRight;
  sortConfig: SortConfig<IpRight>;
  onSort: (key: any) => void;
  className?: string;
}> = ({ title, sortKey, sortConfig, onSort, className }) => {
  const isSorted = sortConfig?.key === sortKey;
  const direction = isSorted ? sortConfig.direction : undefined;

  return (
    <th scope="col" className={`py-3.5 text-left text-sm font-semibold text-gray-300 ${className}`}>
      <button onClick={() => onSort(sortKey)} className="group inline-flex items-center">
        {title}
        <span className={`ml-2 flex-none rounded ${isSorted ? 'bg-gray-600 text-gray-200' : 'text-gray-400 invisible group-hover:visible'}`}>
            {direction === 'descending' ? '▼' : '▲'}
        </span>
      </button>
    </th>
  )
};


export const IpRightTable: React.FC<IpRightTableProps> = ({ ipRights, rules, selectedIpRightId, onSelect, onOpenDetail, onEdit, onDelete, sortConfig, onSort }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <SortableHeader title="Name" sortKey="name" sortConfig={sortConfig} onSort={onSort} className="pl-4 pr-3 sm:pl-6" />
              <SortableHeader title="Type" sortKey="ipType" sortConfig={sortConfig} onSort={onSort} className="px-3" />
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Matching Rule</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900/50">
            {ipRights.map((ipRight) => (
              <tr 
                key={ipRight.id}
                onDoubleClick={() => onOpenDetail(ipRight)}
                className={`transition-colors cursor-pointer ${selectedIpRightId === ipRight.id ? 'bg-blue-600/20' : 'hover:bg-gray-800/40'}`}
              >
                <td 
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6"
                    onClick={() => onSelect(ipRight)}
                >
                    <div className="font-semibold">{ipRight.name}</div>
                    <div className="text-gray-400 font-mono text-xs">{ipRight.id}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400" onClick={() => onSelect(ipRight)}>{ipRight.ipType}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                    <MatchingRuleCell ipRight={ipRight} rules={rules} />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex gap-4 justify-end">
                    <button onClick={() => onOpenDetail(ipRight)} className="text-gray-300 hover:text-white">Open</button>
                    <button onClick={() => onEdit(ipRight)} className="text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={() => onDelete(ipRight.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ipRights.length === 0 && (
             <div className="text-center py-12 text-gray-500">
                <h3 className="mt-2 text-sm font-semibold text-gray-300">No IP Rights found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new IP right.</p>
            </div>
        )}
      </div>
    </div>
  );
};
