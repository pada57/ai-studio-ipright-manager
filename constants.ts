// FIX: Removed non-existent 'AllRules' from type import.
// FIX: Corrected import path for types.
import type { IpRight, Rule, RuleSet } from './types';
// FIX: Corrected import path for types.
import { FeeCalculationMode, IpType, IP_STATUSES, IP_ORIGINS } from './types';
import { format } from 'date-fns';


export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'EP', name: 'European Patent Office' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'KR', name: 'South Korea' },
];

export const IP_TYPES: IpType[] = [
    IpType.PATENT,
    IpType.PATENT_DIVISION,
    IpType.PATENT_CONTINUATION,
    IpType.DESIGN,
    IpType.DESIGN_DIVISION,
    IpType.UTILITY_MODEL,
    IpType.TRADEMARK,
];

export const DATE_FIELDS = [
  'Filing Date',
  'Priority Date',
  'Grant Date',
  'Registration Date',
  'Publication Date',
  'Application Date',
];

export const CURRENCIES = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'KRW'];

export const generateDefaultRuleSet = (): RuleSet => ({
  dueDate: {
    baseField: 'Priority Date',
    offsetYears: 1,
    offsetMonths: 6,
    offsetDays: 0,
    description: `Default due date calculation.`,
  },
  lifetime: {
    baseField: 'Filing Date',
    durationYears: 20,
    durationMonths: 0,
    description: `Default lifetime.`,
  },
  fees: {
    currency: 'USD',
    calculationMode: FeeCalculationMode.PER_ANNUITY,
    amount: 150,
    description: `Default annual fees.`,
  },
  paymentPeriods: {
    freeGraceYears: 0,
    freeGraceMonths: 6,
    freeGraceDays: 0,
    totalGraceYears: 1,
    totalGraceMonths: 0,
    totalGraceDays: 0,
    earliestPaymentYears: -1,
    earliestPaymentMonths: 0,
    earliestPaymentDays: 0,
    outputDateBaseField: 'Grant Date',
  },
});

export const SAMPLE_RULES: Rule[] = [
  {
    id: 'rule-us-pat-granted-1',
    rank: 1,
    country: 'US',
    ipType: IpType.PATENT,
    ipStatus: 'Granted',
    ipOrigin: 'ANY',
    conditions: [],
    ruleSet: {
      dueDate: {
        baseField: 'Grant Date',
        offsetYears: 4,
        offsetMonths: -6, // 3.5 years
        offsetDays: 0,
        description: 'First annuity due at 3.5 years from Grant Date.',
      },
      lifetime: {
        baseField: 'Filing Date',
        durationYears: 20,
        durationMonths: 0,
        description: 'Standard 20-year patent term from filing.',
      },
      fees: {
        currency: 'USD',
        calculationMode: FeeCalculationMode.PER_ANNUITY,
        amount: 250,
        description: 'Standard USPTO annuity fees.',
      },
      paymentPeriods: {
        freeGraceYears: 0,
        freeGraceMonths: 6,
        freeGraceDays: 0,
        totalGraceYears: 0,
        totalGraceMonths: 6,
        totalGraceDays: 0,
        earliestPaymentYears: 0,
        earliestPaymentMonths: -6,
        earliestPaymentDays: 0,
        outputDateBaseField: 'Grant Date',
      },
    },
    createdBy: 'System Seed',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastModifiedBy: 'System Seed',
    lastModifiedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'rule-any-design-granted-2',
    rank: 2,
    country: 'ANY',
    ipType: IpType.DESIGN,
    ipStatus: 'Granted',
    ipOrigin: 'ANY',
    conditions: [],
    ruleSet: {
      dueDate: {
        baseField: 'Registration Date',
        offsetYears: 5,
        offsetMonths: 0,
        offsetDays: 0,
        description: 'First renewal due 5 years from registration.',
      },
      lifetime: {
        baseField: 'Filing Date',
        durationYears: 15,
        durationMonths: 0,
        description: 'Standard 15-year design term.',
      },
      fees: {
        currency: 'EUR',
        calculationMode: FeeCalculationMode.PER_ANNUITY,
        amount: 120,
        description: 'Standard design renewal fees.',
      },
      paymentPeriods: {
        freeGraceYears: 0,
        freeGraceMonths: 6,
        freeGraceDays: 0,
        totalGraceYears: 0,
        totalGraceMonths: 6,
        totalGraceDays: 0,
        earliestPaymentYears: 0,
        earliestPaymentMonths: -6,
        earliestPaymentDays: 0,
        outputDateBaseField: 'Registration Date',
      },
    },
    createdBy: 'System Seed',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastModifiedBy: 'System Seed',
    lastModifiedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'rule-any-trademark-granted-3',
    rank: 3,
    country: 'ANY',
    ipType: IpType.TRADEMARK,
    ipStatus: 'Granted',
    ipOrigin: 'ANY',
    conditions: [],
    ruleSet: {
      dueDate: {
        baseField: 'Registration Date',
        offsetYears: 10,
        offsetMonths: 0,
        offsetDays: 0,
        description: 'Renewal due every 10 years from registration.',
      },
      lifetime: {
        baseField: 'Registration Date',
        durationYears: 100, // Effectively infinite, as it's renewable
        durationMonths: 0,
        description: 'Trademarks can be renewed indefinitely.',
      },
      fees: {
        currency: 'USD',
        calculationMode: FeeCalculationMode.PER_ANNUITY, // Simulating renewal fee
        amount: 450,
        description: 'Standard trademark renewal fee.',
      },
      paymentPeriods: {
        freeGraceYears: 0,
        freeGraceMonths: 6,
        freeGraceDays: 0,
        totalGraceYears: 0,
        totalGraceMonths: 6,
        totalGraceDays: 0,
        earliestPaymentYears: -1,
        earliestPaymentMonths: 0,
        earliestPaymentDays: 0,
        outputDateBaseField: 'Registration Date',
      },
    },
    createdBy: 'System Seed',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastModifiedBy: 'System Seed',
    lastModifiedAt: '2024-01-01T00:00:00.000Z',
  },
];


const getRandomItem = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatDateISO = (date: Date): string => format(date, 'yyyy-MM-dd');

const generateMockIpRights = (count: number): IpRight[] => {
    const ipRights: IpRight[] = [];
    const names = ['Quantum Entanglement Communicator', 'Fusion Reactor Miniaturizer', 'AI-Powered Personal Assistant', 'Self-Healing Polymer', 'Holographic Display Technology', 'Bio-Synthetic Organ Replacement', 'Graphene Supercapacitor', 'Neural Interface Device', 'Antimatter Propulsion System', 'Automated Vertical Farm'];

    for (let i = 0; i < count; i++) {
        const country = getRandomItem(COUNTRIES);
        const ipType = getRandomItem(IP_TYPES);
        const ipStatus = Math.random() > 0.3 ? 'Granted' : 'Pending';
        const ipOrigin = getRandomItem(IP_ORIGINS.filter(o => o !== 'ANY'));
        const name = `${getRandomItem(names)} #${i + 1}`;
        const now = new Date();
        const createdAt = randomDate(new Date(1990, 0, 1), now).toISOString();

        const priorityDate = randomDate(new Date(1990, 0, 1), new Date(2022, 0, 1));
        const applicationDate = randomDate(priorityDate, new Date(2023, 0, 1));
        const publicationDate = randomDate(applicationDate, new Date(2024, 0, 1));
        
        const ipRight: IpRight = {
            id: `${country.code}-${String(i + 1).padStart(5, '0')}`,
            name,
            country: country.code,
            ipType,
            ipStatus,
            ipOrigin,
            'Priority Date': formatDateISO(priorityDate),
            'Application Date': formatDateISO(applicationDate),
            'Filing Date': formatDateISO(applicationDate), // Often same as application
            'Publication Date': formatDateISO(publicationDate),
            createdBy: 'System Seed',
            createdAt,
            lastModifiedBy: 'System Seed',
            lastModifiedAt: createdAt,
        };

        if (ipStatus === 'Granted') {
             const grantDate = randomDate(publicationDate, now);
             ipRight['Grant Date'] = formatDateISO(grantDate);
             if (ipType === IpType.DESIGN || ipType === IpType.TRADEMARK) {
                ipRight['Registration Date'] = formatDateISO(grantDate);
             }
             ipRight.lastModifiedAt = grantDate.toISOString();
        }

        ipRights.push(ipRight);
    }
    return ipRights;
};

export const SAMPLE_IP_RIGHTS: IpRight[] = generateMockIpRights(1000);
