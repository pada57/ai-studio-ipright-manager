import React from 'react';
// FIX: Corrected import path for types.
import type { DueDateRule as DueDateRuleType } from '../types';
// FIX: Corrected import path for constants.
import { DATE_FIELDS } from '../constants';
import { Card } from './common/Card';
import { Select } from './common/Select';
import { Input } from './common/Input';

interface DueDateRuleProps {
  rule: DueDateRuleType;
  onChange: (newRule: DueDateRuleType) => void;
  errors: Record<string, string>;
}

const NumberInputGroup: React.FC<{ label: string; value: number; onChange: (value: number) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">{label}</label>
        <Input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)} />
    </div>
);

export const DueDateRule: React.FC<DueDateRuleProps> = ({ rule, onChange, errors }) => {
  const descriptionError = errors['dueDate.description'];

  return (
    <Card title="Due Date Definition" description="Define how due dates are calculated based on key events.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="base-field" className="text-sm font-medium text-gray-400 mb-2 block">Base Date Field</label>
          <Select
            id="base-field"
            value={rule.baseField}
            onChange={(e) => onChange({ ...rule, baseField: e.target.value })}
          >
            {DATE_FIELDS.map(field => <option key={field} value={field}>{field}</option>)}
          </Select>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberInputGroup label="Offset Years" value={rule.offsetYears} onChange={(val) => onChange({ ...rule, offsetYears: val })} />
            <NumberInputGroup label="Offset Months" value={rule.offsetMonths} onChange={(val) => onChange({ ...rule, offsetMonths: val })} />
            <NumberInputGroup label="Offset Days" value={rule.offsetDays} onChange={(val) => onChange({ ...rule, offsetDays: val })} />
        </div>

        <div className="md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-400 mb-2 block">Description</label>
            <Input 
                as="textarea"
                id="description"
                rows={3}
                value={rule.description}
                onChange={(e) => onChange({ ...rule, description: e.target.value })}
                placeholder="E.g., 18 months from the earliest priority date."
                className={descriptionError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {descriptionError && <p className="text-red-400 text-xs mt-1">{descriptionError}</p>}
        </div>
      </div>
    </Card>
  );
};