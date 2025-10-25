

import React from 'react';
// FIX: Corrected import path for types.
import type { PaymentPeriodsRule as PaymentPeriodRuleType } from '../types';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Select } from './common/Select';
// FIX: Corrected import path for constants.
import { DATE_FIELDS } from '../constants';

interface PaymentPeriodRuleProps {
  rule: PaymentPeriodRuleType;
  onChange: (newRule: PaymentPeriodRuleType) => void;
}

const PeriodInputGroup: React.FC<{
    years: number;
    months: number;
    days: number;
    onYearsChange: (val: number) => void;
    onMonthsChange: (val: number) => void;
    onDaysChange: (val: number) => void;
}> = ({ years, months, days, onYearsChange, onMonthsChange, onDaysChange }) => (
    <div className="grid grid-cols-3 gap-4">
        <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Years</label>
            <Input type="number" value={years} onChange={e => onYearsChange(parseInt(e.target.value, 10) || 0)} />
        </div>
        <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Months</label>
            <Input type="number" value={months} onChange={e => onMonthsChange(parseInt(e.target.value, 10) || 0)} />
        </div>
        <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Days</label>
            <Input type="number" value={days} onChange={e => onDaysChange(parseInt(e.target.value, 10) || 0)} />
        </div>
    </div>
);


export const PaymentPeriodsRule: React.FC<PaymentPeriodRuleProps> = ({ rule, onChange }) => {
  return (
    <Card title="Payment Periods" description="Configure grace periods and payment windows.">
      <div className="space-y-8">
        <div>
          <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Grace Periods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Free Grace Period</h4>
              <PeriodInputGroup
                years={rule.freeGraceYears}
                months={rule.freeGraceMonths}
                days={rule.freeGraceDays}
                onYearsChange={val => onChange({...rule, freeGraceYears: val})}
                onMonthsChange={val => onChange({...rule, freeGraceMonths: val})}
                onDaysChange={val => onChange({...rule, freeGraceDays: val})}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Total Grace Period (with surcharge)</h4>
              <PeriodInputGroup
                years={rule.totalGraceYears}
                months={rule.totalGraceMonths}
                days={rule.totalGraceDays}
                onYearsChange={val => onChange({...rule, totalGraceYears: val})}
                onMonthsChange={val => onChange({...rule, totalGraceMonths: val})}
                onDaysChange={val => onChange({...rule, totalGraceDays: val})}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Payment Window</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Earliest Payment Date (Offset before due date)</h4>
              <PeriodInputGroup
                years={rule.earliestPaymentYears}
                months={rule.earliestPaymentMonths}
                days={rule.earliestPaymentDays}
                onYearsChange={val => onChange({...rule, earliestPaymentYears: val})}
                onMonthsChange={val => onChange({...rule, earliestPaymentMonths: val})}
                onDaysChange={val => onChange({...rule, earliestPaymentDays: val})}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Output Date Base Field</h4>
              <Select
                value={rule.outputDateBaseField}
                onChange={(e) => onChange({ ...rule, outputDateBaseField: e.target.value })}
              >
                 {DATE_FIELDS.map(field => <option key={field} value={field}>{field}</option>)}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
