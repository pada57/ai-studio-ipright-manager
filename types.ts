import { add } from "date-fns";

export enum IpType {
  PATENT = 'Patent',
  PATENT_DIVISION = 'Patent (Divisional)',
  PATENT_CONTINUATION = 'Patent (Continuation)',
  DESIGN = 'Design',
  DESIGN_DIVISION = 'Design (Divisional)',
  UTILITY_MODEL = 'Utility Model',
  TRADEMARK = 'Trademark',
}

export const IP_STATUSES = ['ANY', 'Pending', 'Granted', 'Expired', 'Abandoned'] as const;
export const IP_ORIGINS = ['ANY', 'National', 'European', 'International'] as const;

export enum FeeCalculationMode {
  PER_ANNUITY = 'Per Annuity',
  FIXED_ONCE = 'Fixed (Once)',
}

export type DueDateRule = {
  baseField: string;
  offsetYears: number;
  offsetMonths: number;
  offsetDays: number;
  description: string;
};

export type LifetimeRule = {
  baseField: string;
  durationYears: number;
  durationMonths: number;
  description: string;
};

export type FeeRule = {
  currency: string;
  calculationMode: FeeCalculationMode;
  amount: number;
  description: string;
};

export type PaymentPeriodsRule = {
  freeGraceYears: number;
  freeGraceMonths: number;
  freeGraceDays: number;
  totalGraceYears: number;
  totalGraceMonths: number;
  totalGraceDays: number;
  earliestPaymentYears: number;
  earliestPaymentMonths: number;
  earliestPaymentDays: number;
  outputDateBaseField: string;
};

export type RuleSet = {
  dueDate: DueDateRule;
  lifetime: LifetimeRule;
  fees: FeeRule;
  paymentPeriods: PaymentPeriodsRule;
};

export const CONDITION_FIELDS = ['Filing Date', 'Priority Date', 'Grant Date', 'Registration Date', 'Publication Date', 'Application Date'] as const;
export type ConditionField = typeof CONDITION_FIELDS[number];

export const CONDITION_OPERATORS = ['>', '<', '>=', '<=', '=', '!='] as const;
export type ConditionOperator = typeof CONDITION_OPERATORS[number];

export type Condition = {
  id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string; // date string
};

export type Rule = {
  id: string;
  rank: number;
  country: string; // 'ANY' or country code
  ipType: IpType | 'ANY';
  ipStatus: typeof IP_STATUSES[number] | 'ANY';
  ipOrigin: typeof IP_ORIGINS[number] | 'ANY';
  conditions: Condition[];
  ruleSet: RuleSet;
  // Audit Fields
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
};

export type IpRight = {
  id: string;
  name: string;
  country: string;
  ipType: IpType;
  ipStatus: string;
  ipOrigin: string;
  'Application Date'?: string;
  'Filing Date'?: string;
  'Priority Date'?: string;
  'Grant Date'?: string;
  'Registration Date'?: string;
  'Publication Date'?: string;
  // Audit Fields
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
};

export type CalculatedEvent = {
    name: string;
    date: string;
    description: string;
    ruleId: string;
};

export type CalculatedAnnuity = {
    annuity: number;
    dueDate: string;
    fee: string;
    earliestPayment: string;
    freeGraceEnd: string;
    surchargeGraceEnd: string;
};

export type ExecutionStep = {
    criterion: string;
    ruleValue: string;
    ipRightValue: string;
    match: boolean;
    result: string;
};

export type ExecutionPlan = ExecutionStep[];

// Sorting Types
export type SortDirection = 'ascending' | 'descending';

export type SortConfig<T> = {
  key: keyof T;
  direction: SortDirection;
} | null;
