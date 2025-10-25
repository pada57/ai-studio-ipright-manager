import React, { useState } from 'react';
// FIX: Corrected import path for types.
import type { RuleSet } from '../types';
import { DueDateRule } from './DueDateRule';
import { LifetimeRule } from './LifetimeRule';
import { FeeRule } from './FeeRule';
import { PaymentPeriodsRule } from './PaymentPeriodsRule';

interface RuleEditorProps {
  ruleSet: RuleSet;
  onChange: (newRuleSet: RuleSet) => void;
  errors: Record<string, string>;
}

type Tab = 'Due Date' | 'Lifetime' | 'Fees' | 'Payment Periods';
const TABS: Tab[] = ['Due Date', 'Lifetime', 'Fees', 'Payment Periods'];

export const RuleEditor: React.FC<RuleEditorProps> = ({ ruleSet, onChange, errors }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Due Date');

  const hasError = (tab: Tab) => {
    switch(tab) {
        case 'Due Date':
            return !!errors['dueDate.description'];
        case 'Lifetime':
            return !!errors['lifetime.description'];
        case 'Fees':
            return !!errors['fees.amount'] || !!errors['fees.description'];
        default:
            return false;
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors relative
                ${activeTab === tab 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
            >
              {tab}
              {hasError(tab) && <span className="absolute top-2 right-[-8px] w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        {activeTab === 'Due Date' && <DueDateRule rule={ruleSet.dueDate} onChange={(data) => onChange({ ...ruleSet, dueDate: data })} errors={errors} />}
        {activeTab === 'Lifetime' && <LifetimeRule rule={ruleSet.lifetime} onChange={(data) => onChange({ ...ruleSet, lifetime: data })} errors={errors} />}
        {activeTab === 'Fees' && <FeeRule rule={ruleSet.fees} onChange={(data) => onChange({ ...ruleSet, fees: data })} errors={errors} />}
        {activeTab === 'Payment Periods' && <PaymentPeriodsRule rule={ruleSet.paymentPeriods} onChange={(data) => onChange({ ...ruleSet, paymentPeriods: data })} />}
      </div>
    </div>
  );
};