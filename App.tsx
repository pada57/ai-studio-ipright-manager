
import React, { useState, useMemo, useCallback } from 'react';
import type { IpRight, Rule, CalculatedAnnuity, SortConfig } from './types';
import { RuleTable } from './components/RuleTable';
import { Button } from './components/common/Button';
import { RuleModal } from './components/RuleModal';
import { useRules } from './hooks/useRules';
import { useIpRights } from './hooks/useIpRights';
import { IpRightTable } from './components/IpRightTable';
import { IpRightModal } from './components/IpRightModal';
import { findMatchingRuleAndPlan, calculateAnnuitySchedule } from './services/lawEngine';
import { Pagination } from './components/common/Pagination';
import { IpRightDetailModal } from './components/IpRightDetailModal';


type View = 'rules' | 'ip_rights';
const ITEMS_PER_PAGE = 15;

type SortableRuleKey = keyof Pick<Rule, 'rank' | 'country' | 'ipType' | 'ipStatus' | 'ipOrigin'>;
type SortableIpRightKey = keyof Pick<IpRight, 'name' | 'ipType'>;

const RulesView = ({ rules, onEdit, onDelete, onOpenModal, ruleUsageCount }: { rules: Rule[], onEdit: (rule: Rule) => void, onDelete: (id: string) => void, onOpenModal: (rule: Rule | null) => void, ruleUsageCount: Map<string, number> }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<Rule>>({ key: 'rank', direction: 'ascending' });

  const handleSortRequest = (key: SortableRuleKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const filteredAndSortedRules = useMemo(() => {
    let filtered = [...rules];
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = rules.filter(rule => 
            rule.country.toLowerCase().includes(lowercasedQuery) ||
            rule.ipType.toLowerCase().includes(lowercasedQuery) ||
            rule.ipStatus.toLowerCase().includes(lowercasedQuery) ||
            rule.ipOrigin.toLowerCase().includes(lowercasedQuery) ||
            rule.conditions.some(c => 
                c.field.toLowerCase().includes(lowercasedQuery) ||
                c.value.toLowerCase().includes(lowercasedQuery)
            )
        );
    }

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [rules, searchQuery, sortConfig]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Law Engine Rules</h1>
          <p className="text-gray-400 mt-1">Define the logic for calculating deadlines and fees.</p>
        </div>
        <Button onClick={() => onOpenModal(null)}>Create New Rule</Button>
      </div>
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
        </div>
        <input
            type="text"
            placeholder="Search by Country, IP Type, Status, Origin, or Condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 bg-white/5 py-2 pl-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <RuleTable rules={filteredAndSortedRules} onEdit={onEdit} onDelete={onDelete} sortConfig={sortConfig} onSort={handleSortRequest} ruleUsageCount={ruleUsageCount}/>
    </>
  );
};

const IpRightsView = ({ ipRights, rules, onOpenModal, onOpenDetail, onDelete, onSelect, selectedIpRight }: { 
    ipRights: IpRight[],
    rules: Rule[],
    onOpenModal: (ipRight: IpRight | null) => void,
    onOpenDetail: (ipRight: IpRight) => void,
    onDelete: (id: string) => void,
    onSelect: (ipRight: IpRight | null) => void,
    selectedIpRight: IpRight | null
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<IpRight>>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);

    const handleSortRequest = (key: SortableIpRightKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedIpRights = useMemo(() => {
        let filtered = [...ipRights];
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = ipRights.filter(ip => 
                ip.name.toLowerCase().includes(lowercasedQuery) ||
                ip.id.toLowerCase().includes(lowercasedQuery) ||
                ip.ipType.toLowerCase().includes(lowercasedQuery)
            );
        }

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aVal = String(a[sortConfig.key] ?? '').toLowerCase();
                const bVal = String(b[sortConfig.key] ?? '').toLowerCase();
                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [ipRights, searchQuery, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedIpRights.length / ITEMS_PER_PAGE));
    
    const paginatedIpRights = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedIpRights.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedIpRights, currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // Reset to page 1 if filters change and current page becomes invalid
    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);
    
    return (
        <>
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">IP Rights Portfolio</h1>
                    <p className="text-gray-400 mt-1">Manage your IP assets and their corresponding legal rules.</p>
                </div>
                <Button onClick={() => onOpenModal(null)}>Add IP Right</Button>
            </div>
             <div className="relative mb-6">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by Name, ID, or Type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-2 pl-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                />
            </div>
            <div className="flex-1 overflow-y-auto -mx-8 px-8">
                <IpRightTable 
                    ipRights={paginatedIpRights} 
                    rules={rules}
                    selectedIpRightId={selectedIpRight?.id || null} 
                    onSelect={onSelect}
                    onEdit={onOpenModal}
                    onDelete={onDelete}
                    onOpenDetail={onOpenDetail}
                    sortConfig={sortConfig}
                    onSort={handleSortRequest}
                />
            </div>
            <div className="flex-shrink-0 -mx-8 -mb-8">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};


function App() {
  const [currentView, setCurrentView] = useState<View>('ip_rights');

  // Rules state
  const { rules, addRule, updateRule, deleteRule } = useRules();
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // IP Rights state
  const { ipRights, addIpRight, updateIpRight, deleteIpRight } = useIpRights();
  const [selectedIpRight, setSelectedIpRight] = useState<IpRight | null>(null);
  const [viewingIpRight, setViewingIpRight] = useState<IpRight | null>(null);
  const [isIpRightModalOpen, setIsIpRightModalOpen] = useState(false);
  const [editingIpRight, setEditingIpRight] = useState<IpRight | null>(null);

  const handleOpenRuleModal = (rule: Rule | null) => {
    setEditingRule(rule);
    setIsRuleModalOpen(true);
  };
  
  const handleSaveRule = (ruleData: Omit<Rule, 'id' | 'rank' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> | Rule) => {
    if ('id' in ruleData) {
      updateRule(ruleData as Rule);
    } else {
      addRule(ruleData);
    }
  };

  const handleOpenIpRightModal = (ipRight: IpRight | null) => {
    setEditingIpRight(ipRight);
    setIsIpRightModalOpen(true);
  };

  const handleSaveIpRight = (ipRightData: Omit<IpRight, 'id' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> | IpRight) => {
    if ('id' in ipRightData) {
        updateIpRight(ipRightData as IpRight);
    } else {
        addIpRight(ipRightData);
    }
  }

  const handleDeleteIpRight = (ipRightId: string) => {
    if (selectedIpRight && selectedIpRight.id === ipRightId) {
        setSelectedIpRight(null);
    }
     if (viewingIpRight && viewingIpRight.id === ipRightId) {
        setViewingIpRight(null);
    }
    deleteIpRight(ipRightId);
  }
  
  const handleOpenDetail = (ipRight: IpRight) => {
    setViewingIpRight(ipRight);
  }

  // Calculate annuities for the IP right being edited to show in the modal preview
  const editingIpRightAnnuities = useMemo((): CalculatedAnnuity[] => {
    if (!editingIpRight) return [];
    const match = findMatchingRuleAndPlan(editingIpRight, rules);
    if (!match) return [];
    return calculateAnnuitySchedule(editingIpRight, match.rule);
  }, [editingIpRight, rules]);

  const ruleUsageCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ipRight of ipRights) {
        const match = findMatchingRuleAndPlan(ipRight, rules);
        if (match) {
            counts.set(match.rule.id, (counts.get(match.rule.id) || 0) + 1);
        }
    }
    return counts;
  }, [ipRights, rules]);

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex overflow-hidden">
      <div className="flex-1 flex flex-col">
          <header className="bg-gray-800/50 border-b border-gray-700 px-8 py-4 flex justify-between items-center">
             <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M12 11.13V22"></path>
                    <path d="m19.34 7.6-14.7 6.82"></path>
                </svg>
                <h1 className="text-xl font-bold text-gray-100">IP Law Engine</h1>
            </div>
              <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-lg p-1">
                  <button 
                    onClick={() => setCurrentView('ip_rights')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${currentView === 'ip_rights' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    IP Portfolio
                  </button>
                   <button 
                    onClick={() => setCurrentView('rules')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${currentView === 'rules' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    Rule Editor
                  </button>
              </div>
          </header>

          <main className="flex-1 p-8 flex flex-col overflow-hidden">
            {currentView === 'rules' ? (
                <RulesView rules={rules} onDelete={deleteRule} onEdit={handleOpenRuleModal} onOpenModal={handleOpenRuleModal} ruleUsageCount={ruleUsageCount} />
            ) : (
                <IpRightsView 
                    ipRights={ipRights} 
                    rules={rules} 
                    onDelete={handleDeleteIpRight} 
                    onOpenDetail={handleOpenDetail} 
                    onOpenModal={handleOpenIpRightModal}
                    onSelect={setSelectedIpRight}
                    selectedIpRight={selectedIpRight}
                />
            )}
          </main>
      </div>
      
      <RuleModal 
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onSave={handleSaveRule}
        existingRule={editingRule}
      />
      <IpRightModal
        isOpen={isIpRightModalOpen}
        onClose={() => setIsIpRightModalOpen(false)}
        onSave={handleSaveIpRight}
        existingIpRight={editingIpRight}
        annuityPreview={editingIpRightAnnuities}
      />
      <IpRightDetailModal 
        ipRight={viewingIpRight}
        rules={rules}
        onClose={() => setViewingIpRight(null)}
      />
    </div>
  );
}

export default App;
