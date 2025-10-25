import React from 'react';
// FIX: Corrected import path for types.
import type { FeeRule as FeeRuleType } from '../types';
// FIX: Corrected import path for types.
import { FeeCalculationMode } from '../types';
// FIX: Corrected import path for constants.
import { CURRENCIES } from '../constants';
import { Card } from './common/Card';
import { Select } from './common/Select';
import { Input } from './common/Input';

interface FeeRuleProps {
  rule: FeeRuleType;
  onChange: (newRule: FeeRuleType) => void;
  errors: Record<string, string>;
}

export const FeeRule: React.FC<FeeRuleProps> = ({ rule, onChange, errors }) => {
  const amountError = errors['fees.amount'];
  const descriptionError = errors['fees.description'];

  return (
    <Card title="Fee Structure" description="Define the applicable fees, currency, and calculation method.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="calculation-mode" className="text-sm font-medium text-gray-400 mb-2 block">Calculation Mode</label>
          <Select
            id="calculation-mode"
            value={rule.calculationMode}
            onChange={(e) => onChange({ ...rule, calculationMode: e.target.value as FeeCalculationMode })}
          >
            {Object.values(FeeCalculationMode).map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </Select>
        </div>
        
        <div>
            <label htmlFor="currency" className="text-sm font-medium text-gray-400 mb-2 block">Currency</label>
            <Select
                id="currency"
                value={rule.currency}
                onChange={(e) => onChange({ ...rule, currency: e.target.value })}
            >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
        </div>
        
        <div className="md:col-span-2">
            <label htmlFor="amount" className="text-sm font-medium text-gray-400 mb-2 block">
                {rule.calculationMode === FeeCalculationMode.PER_ANNUITY ? 'Amount per Annuity' : 'Fixed Amount'}
            </label>
            <Input
                id="amount"
                type="number"
                value={rule.amount}
                onChange={(e) => onChange({ ...rule, amount: parseFloat(e.target.value) || 0 })}
                className={amountError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}

            />
            {amountError && <p className="text-red-400 text-xs mt-1">{amountError}</p>}
        </div>

        <div className="md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-400 mb-2 block">Description</label>
            <Input 
                as="textarea"
                id="description"
                rows={3}
                value={rule.description}
                onChange={(e) => onChange({ ...rule, description: e.target.value })}
                placeholder="E.g., Annual maintenance fees, subject to increase."
                className={descriptionError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {descriptionError && <p className="text-red-400 text-xs mt-1">{descriptionError}</p>}
        </div>
      </div>
    </Card>
  );
};