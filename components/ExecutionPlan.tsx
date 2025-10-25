import React from 'react';
import type { ExecutionPlan } from '../types';

interface ExecutionPlanTooltipProps {
    plan: ExecutionPlan;
    children: React.ReactNode;
}

const CheckmarkIcon = () => (
    <svg className="w-4 h-4 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
     <svg className="w-4 h-4 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


export const ExecutionPlanTooltip: React.FC<ExecutionPlanTooltipProps> = ({ plan, children }) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-md bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 z-10
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                <h4 className="font-semibold text-sm text-white mb-2 border-b border-gray-700 pb-1.5">Rule Matching Trace</h4>
                <ul className="space-y-1.5 text-xs">
                    {plan.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <div className="flex-shrink-0 pt-0.5">
                                {step.match ? <CheckmarkIcon /> : <XCircleIcon />}
                            </div>
                            <div className="flex-1">
                                <span className="font-semibold text-gray-300">{step.criterion}:</span>
                                <div className="pl-2">
                                    <p className="text-gray-400 font-mono">Rule requires: <span className="text-gray-200">{step.ruleValue}</span></p>
                                    <p className="text-gray-400 font-mono">IP right has: <span className="text-gray-200">{step.ipRightValue}</span></p>
                                </div>
                            </div>
                             <div className={`font-bold ${step.match ? 'text-green-400' : 'text-red-400'}`}>{step.result}</div>
                        </li>
                    ))}
                </ul>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-700"></div>
            </div>
        </div>
    );
};
