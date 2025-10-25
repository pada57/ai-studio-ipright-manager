
import React from 'react';
// FIX: Corrected import path for types.
import type { Rule, Condition, SortConfig } from '../types';

interface RuleTableProps {
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (ruleId: string) => void;
  sortConfig: SortConfig<Rule>;
  onSort: (key: keyof Pick<Rule, 'rank' | 'country' | 'ipType' | 'ipStatus' | 'ipOrigin'>) => void;
  ruleUsageCount: Map<string, number>;
}

const ConditionBadge: React.FC<{condition: Condition}> = ({ condition }) => (
    <span className="inline-block bg-gray-700 text-gray-300 text-xs font-mono px-2 py-1 rounded">
        {condition.field} {condition.operator} {condition.value}
    </span>
);

const SortableHeader: React.FC<{
  title: string;
  sortKey: keyof Rule;
  sortConfig: SortConfig<Rule>;
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


export const RuleTable: React.FC<RuleTableProps> = ({ rules, onEdit, onDelete, sortConfig, onSort, ruleUsageCount }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <SortableHeader title="Rank" sortKey="rank" sortConfig={sortConfig} onSort={onSort} className="pl-4 pr-3 sm:pl-6" />
              <SortableHeader title="Country" sortKey="country" sortConfig={sortConfig} onSort={onSort} className="px-3" />
              <SortableHeader title="IP Type" sortKey="ipType" sortConfig={sortConfig} onSort={onSort} className="px-3" />
              <SortableHeader title="Status" sortKey="ipStatus" sortConfig={sortConfig} onSort={onSort} className="px-3" />
              <SortableHeader title="Origin" sortKey="ipOrigin" sortConfig={sortConfig} onSort={onSort} className="px-3" />
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Conditions</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Usage</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900/50">
            {rules.map((rule) => {
              const count = ruleUsageCount.get(rule.id) || 0;
              return (
              <tr key={rule.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{rule.rank}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{rule.country}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{rule.ipType}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{rule.ipStatus}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{rule.ipOrigin}</td>
                <td className="px-3 py-4 text-sm text-gray-400">
                    <div className="flex flex-wrap gap-1">
                        {rule.conditions.length > 0 ? rule.conditions.map(c => <ConditionBadge key={c.id} condition={c} />) : <span className="text-gray-500">None</span>}
                    </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${count > 0 ? 'bg-blue-600/30 text-blue-300' : 'bg-gray-700 text-gray-400'}`}>
                        {count}
                    </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => onEdit(rule)} className="text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={() => onDelete(rule.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {rules.length === 0 && (
             <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-300">No matching rules found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search query.</p>
            </div>
        )}
      </div>
    </div>
  );
};
