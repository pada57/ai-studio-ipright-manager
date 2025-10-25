

// FIX: Corrected import path for types.
import type { Rule, IpRight } from '../types';
// FIX: Corrected import path for constants.
import { SAMPLE_IP_RIGHTS, SAMPLE_RULES } from '../constants';

const RULES_KEY = 'ip-law-engine-rules';
const IP_RIGHTS_KEY = 'ip-law-engine-ip-rights';

// --- Rules DB ---
export const getRules = (): Rule[] => {
  try {
    const rulesJson = localStorage.getItem(RULES_KEY);
    if (rulesJson) {
        return JSON.parse(rulesJson);
    }
    // If no rules, seed with sample data and save it
    saveRules(SAMPLE_RULES);
    return SAMPLE_RULES;
  } catch (error) {
    console.error("Failed to parse rules from localStorage", error);
    return SAMPLE_RULES; // fallback to sample data
  }
};

export const saveRules = (rules: Rule[]): void => {
  try {
    localStorage.setItem(RULES_KEY, JSON.stringify(rules));
  } catch (error) {
    console.error("Failed to save rules to localStorage", error);
  }
};

// --- IP Rights DB ---
export const getIpRights = (): IpRight[] => {
  try {
    const ipRightsJson = localStorage.getItem(IP_RIGHTS_KEY);
    // Add a check to see if the stored data is the old, small sample.
    const storedData = ipRightsJson ? JSON.parse(ipRightsJson) : [];
    if (ipRightsJson && storedData.length > 100) { // Assume if more than 100, it's the large set
      return storedData;
    }
    // If no data, or old data, seed with the large sample data and save it
    saveIpRights(SAMPLE_IP_RIGHTS);
    return SAMPLE_IP_RIGHTS;
  } catch (error) {
    console.error("Failed to parse IP rights from localStorage", error);
    return SAMPLE_IP_RIGHTS; // fallback to sample data
  }
};

export const saveIpRights = (ipRights: IpRight[]): void => {
  try {
    localStorage.setItem(IP_RIGHTS_KEY, JSON.stringify(ipRights));
  } catch (error)
    {
    console.error("Failed to save IP rights to localStorage", error);
  }
};