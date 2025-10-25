import React, { useMemo } from 'react';
import type { IpRight, Rule, CalculatedAnnuity, ExecutionPlan } from '../types';
import { findMatchingRuleAndPlan, calculateAnnuitySchedule } from '../services/lawEngine';
import { AnnuityTable } from './AnnuityTable';
import { AuditInfo } from './AuditInfo';
import { ExecutionPlanTooltip } from './ExecutionPlan';

interface IpRightDetailProps {
  ipRight: IpRight;
  rules: Rule[];
}

const DetailItem: React.FC<{label: string, value?: string}> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <dt className="text-sm font-medium text-gray-400">{label}</dt>
            <dd className="mt-1 text-sm text-gray-200">{value}</dd>
        </div>
    );
};

export const IpRightDetail: React.FC<IpRightDetailProps> = ({ ipRight, rules }) => {
  const { matchingRule, executionPlan, annuitySchedule } = useMemo(() => {
    const match = findMatchingRuleAndPlan(ipRight, rules);
    if (!match) {
        return { matchingRule: null, executionPlan: null, annuitySchedule: [] };
    }
    const schedule = calculateAnnuitySchedule(ipRight, match.rule);
    return { matchingRule: match.rule, executionPlan: match.plan, annuitySchedule: schedule };
  }, [ipRight, rules]);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">{ipRight.name}</h2>
        <p className="text-sm text-gray-400 mt-1 font-mono">{ipRight.id}</p>
      </div>

      {/* Core Details */}
      <div className="border-t border-gray-700 pt-6">
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
            <DetailItem label="Type" value={ipRight.ipType} />
            <DetailItem label="Country" value={ipRight.country} />
            <DetailItem label="Status" value={ipRight.ipStatus} />
            <DetailItem label="Origin" value={ipRight.ipOrigin} />
            <DetailItem label="Priority Date" value={ipRight['Priority Date']} />
            <DetailItem label="Application Date" value={ipRight['Application Date']} />
            <DetailItem label="Filing Date" value={ipRight['Filing Date']} />
            <DetailItem label="Grant Date" value={ipRight['Grant Date']} />
            <DetailItem label="Registration Date" value={ipRight['Registration Date']} />
        </dl>
      </div>
      
       {/* Annuity Schedule */}
      <div className="border-t border-gray-700 pt-6">
         <h3 className="text-lg font-semibold text-gray-200 mb-2">Calculated Annuities</h3>
         {matchingRule && executionPlan ? (
            <p className="text-sm text-gray-400 mb-4">
                Calculations based on rule{' '}
                <ExecutionPlanTooltip plan={executionPlan}>
                    <span className="font-mono bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-xs cursor-help">
                        {matchingRule.id}
                    </span>
                </ExecutionPlanTooltip>
            </p>
         ) : (
            <p className="text-sm text-gray-400 mb-4">No matching rule found.</p>
         )}
         <div>
            <AnnuityTable annuities={annuitySchedule} />
         </div>
      </div>
      
      {/* Audit Info */}
      <div className="border-t border-gray-700 pt-4">
        <AuditInfo {...ipRight} />
      </div>

    </div>
  );
};