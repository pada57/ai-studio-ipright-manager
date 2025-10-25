import React from 'react';
import type { CalculatedAnnuity } from '../types';

interface AnnuityTableProps {
    annuities: CalculatedAnnuity[];
}

export const AnnuityTable: React.FC<AnnuityTableProps> = ({ annuities }) => {
    if (annuities.length === 0) {
        return (
             <div className="text-center py-8 px-4 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
                <svg className="mx-auto h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-300">No Annuities Calculated</h3>
                <p className="mt-1 text-sm text-gray-500">
                    This could be because no matching rule was found or the IP right has expired.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Annuity</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fee</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Earliest Payment</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Free Grace End</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Surcharge End</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-gray-700/50">
                    {annuities.map(annuity => (
                        <tr key={annuity.annuity}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">{annuity.annuity}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">{annuity.dueDate}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{annuity.fee}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">{annuity.earliestPayment}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-400 font-mono">{annuity.freeGraceEnd}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-red-400 font-mono">{annuity.surchargeGraceEnd}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
