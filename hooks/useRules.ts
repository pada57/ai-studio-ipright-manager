
import { useState, useCallback, useEffect } from 'react';
import type { Rule } from '../types';
import * as db from '../services/db';

const FAKE_USER = 'System User';

export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getRules().then(initialRules => {
        setRules(initialRules.sort((a, b) => a.rank - b.rank));
        setLoading(false);
    });
  }, []);

  const updateAndPersist = (newRules: Rule[]) => {
      // Re-calculate ranks before saving
      const sortedRules = newRules
        .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)) // Handle potentially missing ranks from import
        .map((rule, index) => ({ ...rule, rank: index + 1 }));
      setRules(sortedRules);
      db.saveRules(sortedRules);
  };

  const addRule = useCallback((ruleData: Omit<Rule, 'id' | 'rank' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'>) => {
    setRules(prevRules => {
        const now = new Date().toISOString();
        const newRule: Rule = {
          ...ruleData,
          rank: prevRules.length + 1,
          id: crypto.randomUUID(),
          createdBy: FAKE_USER,
          createdAt: now,
          lastModifiedBy: FAKE_USER,
          lastModifiedAt: now,
        };
        const updatedRules = [...prevRules, newRule];
        updateAndPersist(updatedRules);
        return updatedRules;
    });
  }, []);

  const updateRule = useCallback((updatedRule: Rule) => {
    setRules(prevRules => {
        const newRuleWithAudit = {
            ...updatedRule,
            lastModifiedBy: FAKE_USER,
            lastModifiedAt: new Date().toISOString(),
        };
        const newRules = prevRules.map(r => (r.id === newRuleWithAudit.id ? newRuleWithAudit : r));
        updateAndPersist(newRules);
        return newRules;
    });
  }, []);

  const deleteRule = useCallback((ruleId: string) => {
    setRules(prevRules => {
        const newRules = prevRules.filter(r => r.id !== ruleId);
        updateAndPersist(newRules);
        return newRules;
    });
  }, []);

  const replaceAllRules = useCallback((newRules: Rule[]) => {
    updateAndPersist(newRules);
  }, []);

  return { rules, addRule, updateRule, deleteRule, replaceAllRules, loading };
};
