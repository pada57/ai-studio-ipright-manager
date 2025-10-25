import type { IpRight, Rule, ExecutionPlan, ExecutionStep, CalculatedAnnuity, ConditionField } from '../types';
import { add, format, isBefore, isEqual } from 'date-fns';

/**
 * Finds the first rule that matches the given IP right and returns it along with a detailed execution plan.
 * @param ipRight - The IP right to evaluate.
 * @param rules - The list of all rules, sorted by rank.
 * @returns An object containing the matching rule and the execution plan, or null if no match is found.
 */
export const findMatchingRuleAndPlan = (ipRight: IpRight, rules: Rule[]): { rule: Rule; plan: ExecutionPlan } | null => {
    for (const rule of rules) {
        const plan: ExecutionPlan = [];
        let isMatch = true;

        // Check Country
        const countryMatch = rule.country === 'ANY' || rule.country === ipRight.country;
        plan.push({ criterion: 'Country', ruleValue: rule.country, ipRightValue: ipRight.country, match: countryMatch, result: countryMatch ? 'Match' : 'No Match' });
        if (!countryMatch) {
            isMatch = false;
        }

        // Check IP Type
        const ipTypeMatch = rule.ipType === 'ANY' || rule.ipType === ipRight.ipType;
        plan.push({ criterion: 'IP Type', ruleValue: rule.ipType, ipRightValue: ipRight.ipType, match: ipTypeMatch, result: ipTypeMatch ? 'Match' : 'No Match' });
        if (isMatch && !ipTypeMatch) {
             isMatch = false;
        }

        // Check IP Status
        const ipStatusMatch = rule.ipStatus === 'ANY' || rule.ipStatus === ipRight.ipStatus;
        plan.push({ criterion: 'IP Status', ruleValue: rule.ipStatus, ipRightValue: ipRight.ipStatus, match: ipStatusMatch, result: ipStatusMatch ? 'Match' : 'No Match' });
        if (isMatch && !ipStatusMatch) {
             isMatch = false;
        }
        
        // Check IP Origin
        const ipOriginMatch = rule.ipOrigin === 'ANY' || rule.ipOrigin === ipRight.ipOrigin;
        plan.push({ criterion: 'IP Origin', ruleValue: rule.ipOrigin, ipRightValue: ipRight.ipOrigin, match: ipOriginMatch, result: ipOriginMatch ? 'Match' : 'No Match' });
        if (isMatch && !ipOriginMatch) {
             isMatch = false;
        }

        // Check Conditions
        if (isMatch) {
             for (const cond of rule.conditions) {
                const ipRightDateStr = ipRight[cond.field as keyof IpRight] as string | undefined;
                if (!ipRightDateStr) {
                    isMatch = false;
                    plan.push({ criterion: `Condition: ${cond.field}`, ruleValue: `${cond.operator} ${cond.value}`, ipRightValue: 'N/A', match: false, result: 'IP Right date missing' });
                    break;
                }
                const ipRightDate = new Date(ipRightDateStr).getTime();
                const condDate = new Date(cond.value).getTime();

                let conditionMet = false;
                switch (cond.operator) {
                    case '>': conditionMet = ipRightDate > condDate; break;
                    case '<': conditionMet = ipRightDate < condDate; break;
                    case '>=': conditionMet = ipRightDate >= condDate; break;
                    case '<=': conditionMet = ipRightDate <= condDate; break;
                    case '=': conditionMet = ipRightDate === condDate; break;
                    case '!=': conditionMet = ipRightDate !== condDate; break;
                }
                 plan.push({ criterion: `Condition: ${cond.field}`, ruleValue: `${cond.operator} ${cond.value}`, ipRightValue: ipRightDateStr, match: conditionMet, result: conditionMet ? 'Met' : 'Not Met' });

                if (!conditionMet) {
                    isMatch = false;
                    break;
                }
            }
        }

        if (isMatch) {
            return { rule, plan };
        }
    }
    return null;
};

/**
 * Calculates the full annuity schedule for an IP right based on a matching rule.
 * @param ipRight - The IP right.
 * @param rule - The matching law engine rule.
 * @returns An array of all calculated annuities.
 */
export const calculateAnnuitySchedule = (ipRight: IpRight, rule: Rule): CalculatedAnnuity[] => {
    const { ruleSet } = rule;
    const schedule: CalculatedAnnuity[] = [];
    
    const lifetimeBaseDateStr = ipRight[ruleSet.lifetime.baseField as ConditionField];
    if (!lifetimeBaseDateStr) return [];
    
    const expiryDate = add(new Date(lifetimeBaseDateStr), {
        years: ruleSet.lifetime.durationYears,
        months: ruleSet.lifetime.durationMonths
    });

    const firstDueDateBaseStr = ipRight[ruleSet.dueDate.baseField as ConditionField];
    if (!firstDueDateBaseStr) return [];

    let currentDueDate = add(new Date(firstDueDateBaseStr), {
        years: ruleSet.dueDate.offsetYears,
        months: ruleSet.dueDate.offsetMonths,
        days: ruleSet.dueDate.offsetDays
    });

    const paymentWindowBaseDateStr = ipRight[ruleSet.paymentPeriods.outputDateBaseField as ConditionField];
    const paymentWindowBaseDate = paymentWindowBaseDateStr ? new Date(paymentWindowBaseDateStr) : null;
    
    let annuity = ruleSet.dueDate.offsetYears;

    while(isBefore(currentDueDate, expiryDate) || isEqual(currentDueDate, expiryDate)) {
        if (!paymentWindowBaseDate || isAfter(currentDueDate, paymentWindowBaseDate) || isEqual(currentDueDate, paymentWindowBaseDate)) {
             const earliestPayment = add(currentDueDate, {
                years: ruleSet.paymentPeriods.earliestPaymentYears,
                months: ruleSet.paymentPeriods.earliestPaymentMonths,
                days: ruleSet.paymentPeriods.earliestPaymentDays,
            });

            const freeGraceEnd = add(currentDueDate, {
                years: ruleSet.paymentPeriods.freeGraceYears,
                months: ruleSet.paymentPeriods.freeGraceMonths,
                days: ruleSet.paymentPeriods.freeGraceDays,
            });

             const surchargeGraceEnd = add(currentDueDate, {
                years: ruleSet.paymentPeriods.totalGraceYears,
                months: ruleSet.paymentPeriods.totalGraceMonths,
                days: ruleSet.paymentPeriods.totalGraceDays,
            });

            schedule.push({
                annuity,
                dueDate: format(currentDueDate, 'yyyy-MM-dd'),
                fee: `${ruleSet.fees.amount} ${ruleSet.fees.currency}`,
                earliestPayment: format(earliestPayment, 'yyyy-MM-dd'),
                freeGraceEnd: format(freeGraceEnd, 'yyyy-MM-dd'),
                surchargeGraceEnd: format(surchargeGraceEnd, 'yyyy-MM-dd'),
            });
        }
        
        currentDueDate = add(currentDueDate, { years: 1 });
        annuity++;
    }

    return schedule;
};

// Helper to check if a date is after another, for use with potentially null dates
const isAfter = (date: Date, dateToCompare: Date | null) => {
  if (!dateToCompare) return true;
  return isBefore(dateToCompare, date);
};
