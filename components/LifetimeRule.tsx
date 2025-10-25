import React from 'react';
// FIX: Corrected import path for types.
import type { LifetimeRule as LifetimeRuleType } from '../types';
// FIX: Corrected import path for constants.
import { DATE_FIELDS } from '../constants';
import { Card } from './common/Card';
import { Select } from './common/Select';
import { Input } from './common/Input';

interface LifetimeRuleProps {
  rule: LifetimeRuleType;
  onChange: (newRule: LifetimeRuleType) => void;
  errors: Record<string, string>;
}

const NumberInputGroup: React.FC<{ label: string; value: number; onChange: (value: number) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="text-sm font-medium text-gray-400 mb-2 block">{label}</label>
        <Input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)} />
    </div>
);

export const LifetimeRule: React.FC<LifetimeRuleProps> = ({ rule, onChange, errors }) => {
  const descriptionError = errors['lifetime.description'];
  return (
    <Card title="Lifetime & Expiry" description="Define the total duration of the IP right to calculate its expiry date.">
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

        <NumberInputGroup label="Duration Years" value={rule.durationYears} onChange={(val) => onChange({ ...rule, durationYears: val })} />
        <NumberInputGroup label="Duration Months" value={rule.durationMonths} onChange={(val) => onChange({ ...rule, durationMonths: val })} />
        
        <div className="md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-400 mb-2 block">Description</label>
            <Input 
                as="textarea"
                id="description"
                rows={3}
                value={rule.description}
                onChange={(e) => onChange({ ...rule, description: e.target.value })}
                placeholder="E.g., 20 years from the filing date."
                className={descriptionError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {descriptionError && <p className="text-red-400 text-xs mt-1">{descriptionError}</p>}
        </div>
      </div>
    </Card>
  );
};