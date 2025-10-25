
import type { Rule, IpRight } from '../types';
import { SAMPLE_IP_RIGHTS, SAMPLE_RULES } from '../constants';
import { parseCsvText } from './csv';

const RULES_KEY = 'ip-law-engine-rules';
const IP_RIGHTS_KEY = 'ip-law-engine-ip-rights';

// --- Rules DB ---
export const getRules = async (): Promise<Rule[]> => {
  try {
    const rulesJson = localStorage.getItem(RULES_KEY);
    if (rulesJson) {
        return JSON.parse(rulesJson);
    }
    // If no rules in storage, fetch from CSV
    const response = await fetch('/sample_rules.csv');
     if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const csvText = await response.text();
    const sampleRules = parseCsvText<Rule>(csvText);
    saveRules(sampleRules); // Save to localStorage for next time
    return sampleRules;
  } catch (error) {
    console.error("Failed to load rules from CSV or localStorage, using built-in samples as fallback.", error);
    saveRules(SAMPLE_RULES); // Save fallback to localStorage
    return SAMPLE_RULES;
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
export const getIpRights = async (): Promise<IpRight[]> => {
  try {
    const ipRightsJson = localStorage.getItem(IP_RIGHTS_KEY);
     if (ipRightsJson) {
        // Basic check to see if it's the large dataset.
        const parsed = JSON.parse(ipRightsJson);
        if (parsed.length > 100) return parsed;
    }

    // If no data or old data, fetch from CSV
    const response = await fetch('/sample_ip_rights.csv');
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const csvText = await response.text();
    const sampleIpRights = parseCsvText<IpRight>(csvText);
    saveIpRights(sampleIpRights);
    return sampleIpRights;
  } catch (error) {
    console.error("Failed to load IP rights from CSV or localStorage, using built-in samples as fallback.", error);
    saveIpRights(SAMPLE_IP_RIGHTS);
    return SAMPLE_IP_RIGHTS;
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
