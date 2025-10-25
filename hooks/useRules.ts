import { useState, useCallback } from 'react';
// FIX: Corrected import path for types.
import type { Rule } from '../types';
// FIX: Corrected import path for db service.
import * as db from '../services/db';

const FAKE_USER = 'System User';

export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>(() => db.getRules().sort((a, b) => a.rank - b.rank));

  const updateAndPersist = (newRules: Rule[]) => {
      // Re-calculate ranks before saving
      const sortedRules = newRules
        .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)) // Handle potentially missing ranks from import
        .map((rule, index) => ({ ...rule, rank: index + 1 }));
      setRules(sortedRules);
      db.saveRules(sortedRules);
  };

  const addRule = useCallback((ruleData: Omit<Rule, 'id' | 'rank' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'>) => {
    const now = new Date().toISOString();
    const newRule: Rule = {
      ...ruleData,
      rank: rules.length + 1,
      id: crypto.randomUUID(),
      createdBy: FAKE_USER,
      createdAt: now,
      lastModifiedBy: FAKE_USER,
      lastModifiedAt: now,
    };
    updateAndPersist([...rules, newRule]);
  }, [rules]);

  const updateRule = useCallback((updatedRule: Rule) => {
    const newRuleWithAudit = {
        ...updatedRule,
        lastModifiedBy: FAKE_USER,
        lastModifiedAt: new Date().toISOString(),
    };
    const newRules = rules.map(r => (r.id === newRuleWithAudit.id ? newRuleWithAudit : r));
    updateAndPersist(newRules);
  }, [rules]);

  const deleteRule = useCallback((ruleId: string) => {
    const newRules = rules.filter(r => r.id !== ruleId);
    updateAndPersist(newRules);
  }, [rules]);

  const replaceAllRules = useCallback((newRules: Rule[]) => {
    updateAndPersist(newRules);
  }, []);

  return { rules, addRule, updateRule, deleteRule, replaceAllRules };
};
