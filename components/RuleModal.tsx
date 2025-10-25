import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import type { Rule, Condition, RuleSet, ConditionField } from '../types';
// FIX: Corrected import path for constants.
import { generateDefaultRuleSet, COUNTRIES, IP_TYPES } from '../constants';
// FIX: Imported the 'IpType' enum to be used in type casting.
// FIX: Corrected import path for types.
import { IP_STATUSES, IP_ORIGINS, CONDITION_FIELDS, CONDITION_OPERATORS, IpType } from '../types';
import { Modal } from './common/Modal';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { RuleEditor } from './RuleEditor';
import { Input } from './common/Input';
import { AuditInfo } from './AuditInfo';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<Rule, 'id' | 'rank' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> | Rule) => void;
  existingRule: Rule | null;
}

const getDefaultRuleData = (): Omit<Rule, 'id' | 'rank' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> => ({
    country: 'ANY',
    ipType: 'ANY',
    ipStatus: 'ANY',
    ipOrigin: 'ANY',
    conditions: [],
    ruleSet: generateDefaultRuleSet(),
});


export const RuleModal: React.FC<RuleModalProps> = ({ isOpen, onClose, onSave, existingRule }) => {
    const [ruleData, setRuleData] = useState<Omit<Rule, 'id' | 'rank' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt' > | Rule>(getDefaultRuleData());
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (existingRule) {
                setRuleData(JSON.parse(JSON.stringify(existingRule))); // Deep copy
            } else {
                setRuleData(getDefaultRuleData());
            }
            setErrors({}); // Clear errors when modal opens
        }
    }, [existingRule, isOpen]);
    
    const handleRuleSetChange = (newRuleSet: RuleSet) => {
        setRuleData(prev => ({ ...prev, ruleSet: newRuleSet }));
    };

    const handleConditionChange = (index: number, field: keyof Condition, value: any) => {
        const newConditions = [...ruleData.conditions];
        newConditions[index] = { ...newConditions[index], [field]: value };
        setRuleData(prev => ({...prev, conditions: newConditions}));
    };
    
    const addCondition = () => {
        const newCondition: Condition = {
            id: crypto.randomUUID(),
            field: 'Grant Date',
            operator: '>',
            value: new Date().toISOString().split('T')[0]
        };
        setRuleData(prev => ({...prev, conditions: [...prev.conditions, newCondition]}));
    };

    const removeCondition = (id: string) => {
        setRuleData(prev => ({...prev, conditions: prev.conditions.filter(c => c.id !== id)}));
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // --- RuleSet Validations ---
        if (ruleData.ruleSet.fees.amount <= 0) {
            newErrors['fees.amount'] = 'Amount must be a positive number.';
        }
        if (!ruleData.ruleSet.fees.description.trim()) {
            newErrors['fees.description'] = 'Description is required.';
        }
        if (!ruleData.ruleSet.dueDate.description.trim()) {
            newErrors['dueDate.description'] = 'Description is required.';
        }
        if (!ruleData.ruleSet.lifetime.description.trim()) {
            newErrors['lifetime.description'] = 'Description is required.';
        }

        // --- Conditions Validations ---
        ruleData.conditions.forEach((cond) => {
            const errorKey = `condition.${cond.id}.value`;
            if (!cond.value) {
                newErrors[errorKey] = 'Date is required.';
            } else if (isNaN(new Date(cond.value).getTime())) {
                newErrors[errorKey] = 'Invalid date format.';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSave = () => {
        if (validate()) {
            onSave(ruleData);
            onClose();
        }
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingRule ? 'Edit Rule' : 'Create New Rule'}>
      <div className="space-y-8">
        {/* --- Rule Criteria --- */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg mb-4 text-gray-200">Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Country</label>
                    <Select value={ruleData.country} onChange={e => setRuleData({...ruleData, country: e.target.value})}>
                        <option value="ANY">Any</option>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">IP Type</label>
                    <Select value={ruleData.ipType} onChange={e => setRuleData({...ruleData, ipType: e.target.value as IpType | 'ANY'})}>
                        <option value="ANY">Any</option>
                        {IP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">IP Status</label>
                    <Select value={ruleData.ipStatus} onChange={e => setRuleData({...ruleData, ipStatus: e.target.value as typeof IP_STATUSES[number]})}>
                        {IP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">IP Origin</label>
                    <Select value={ruleData.ipOrigin} onChange={e => setRuleData({...ruleData, ipOrigin: e.target.value as typeof IP_ORIGINS[number]})}>
                        {IP_ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                </div>
            </div>
        </div>

        {/* --- Conditions --- */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-lg text-gray-200">Conditions (Optional)</h3>
                 <Button onClick={addCondition} className="px-3 py-1 text-xs bg-blue-600/50 hover:bg-blue-600/80">Add Condition</Button>
            </div>
            <div className="space-y-3">
                {ruleData.conditions.map((cond, index) => {
                    const errorKey = `condition.${cond.id}.value`;
                    const error = errors[errorKey];
                    return (
                        <div key={cond.id} className="bg-gray-800/50 p-2 rounded">
                            <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-2 items-center">
                                <Select value={cond.field} onChange={e => handleConditionChange(index, 'field', e.target.value as ConditionField)}>
                                    {CONDITION_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                </Select>
                                <Select value={cond.operator} onChange={e => handleConditionChange(index, 'operator', e.target.value)}>
                                    {CONDITION_OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                                </Select>
                                <Input 
                                    type="date" 
                                    value={cond.value} 
                                    onChange={e => handleConditionChange(index, 'value', e.target.value)} 
                                    className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                                />
                                <button onClick={() => removeCondition(cond.id)} className="text-red-400 hover:text-red-300 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                            {error && <p className="text-red-400 text-xs mt-1 pl-1">{error}</p>}
                        </div>
                    )
                })}
                {ruleData.conditions.length === 0 && <p className="text-sm text-gray-500 text-center py-2">No conditions defined. This rule will apply if the criteria above match.</p>}
            </div>
        </div>

        {/* --- Rule Set Editor --- */}
        <RuleEditor ruleSet={ruleData.ruleSet} onChange={handleRuleSetChange} errors={errors} />

        {/* --- Actions --- */}
        <div className="mt-6 pt-4 border-t border-gray-700">
            {existingRule && (
                 <div className="mb-4">
                    <AuditInfo {...existingRule} />
                </div>
            )}
            <div className="flex justify-end gap-4">
                <Button onClick={onClose} className="bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600">Cancel</Button>
                <Button onClick={handleSave}>{existingRule ? 'Save Changes' : 'Create Rule'}</Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};