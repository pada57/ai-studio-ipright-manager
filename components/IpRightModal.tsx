import React, { useState, useEffect } from 'react';
import type { IpRight, IpType, CalculatedAnnuity } from '../types';
import { COUNTRIES, IP_TYPES, DATE_FIELDS } from '../constants';
import { IP_STATUSES, IP_ORIGINS } from '../types';
import { Modal } from './common/Modal';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { AnnuityTable } from './AnnuityTable';
import { AuditInfo } from './AuditInfo';

interface IpRightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ipRight: Omit<IpRight, 'id' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> | IpRight) => void;
  existingIpRight: IpRight | null;
  annuityPreview: CalculatedAnnuity[];
}

const getDefaultIpRightData = (): Omit<IpRight, 'id' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> => ({
    name: '',
    country: 'US',
    ipType: IP_TYPES[0],
    ipStatus: 'Pending',
    ipOrigin: 'National',
});

export const IpRightModal: React.FC<IpRightModalProps> = ({ isOpen, onClose, onSave, existingIpRight, annuityPreview }) => {
    const [ipRightData, setIpRightData] = useState<Omit<IpRight, 'id' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'> | IpRight>(getDefaultIpRightData());

    useEffect(() => {
        if (existingIpRight) {
            setIpRightData(JSON.parse(JSON.stringify(existingIpRight)));
        } else {
            setIpRightData(getDefaultIpRightData());
        }
    }, [existingIpRight, isOpen]);

    const handleChange = (field: keyof Omit<IpRight, 'id'>, value: string) => {
        setIpRightData(prev => ({...prev, [field]: value }));
    };

    const handleDateChange = (field: keyof IpRight, value: string) => {
         setIpRightData(prev => ({...prev, [field]: value }));
    }

    const handleSave = () => {
        onSave(ipRightData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingIpRight ? 'Edit IP Right' : 'Create New IP Right'}>
            <div className="space-y-6">
                {/* --- Core Details --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Name / Title</label>
                        <Input value={ipRightData.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g., My Awesome Invention"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Country</label>
                        <Select value={ipRightData.country} onChange={e => handleChange('country', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">IP Type</label>
                        <Select value={ipRightData.ipType} onChange={e => handleChange('ipType', e.target.value as IpType)}>
                            {IP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">IP Status</label>
                        <Select value={ipRightData.ipStatus} onChange={e => handleChange('ipStatus', e.target.value)}>
                           {IP_STATUSES.filter(s => s !== 'ANY').map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">IP Origin</label>
                        <Select value={ipRightData.ipOrigin} onChange={e => handleChange('ipOrigin', e.target.value)}>
                           {IP_ORIGINS.filter(o => o !== 'ANY').map(o => <option key={o} value={o}>{o}</option>)}
                        </Select>
                    </div>
                </div>
                
                {/* --- Key Dates --- */}
                <div className="border-t border-gray-700 pt-6">
                     <h3 className="text-md font-semibold text-gray-300 mb-4">Key Dates</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {DATE_FIELDS.map(field => (
                            <div key={field}>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">{field}</label>
                                <Input 
                                    type="date" 
                                    value={(ipRightData as IpRight)[field as keyof IpRight] || ''} 
                                    onChange={e => handleDateChange(field as keyof IpRight, e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* --- Annuity Preview --- */}
                {existingIpRight && (
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-md font-semibold text-gray-300 mb-4">Upcoming Annuities (Read-only Preview)</h3>
                        <div className="max-h-60 overflow-y-auto">
                            <AnnuityTable annuities={annuityPreview} />
                        </div>
                    </div>
                )}

                {/* --- Actions & Audit --- */}
                <div className="pt-4 border-t border-gray-700">
                     {existingIpRight && (
                        <div className="mb-4">
                            <AuditInfo {...existingIpRight} />
                        </div>
                     )}
                    <div className="flex justify-end gap-4">
                        <Button onClick={onClose} className="bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600">Cancel</Button>
                        <Button onClick={handleSave}>{existingIpRight ? 'Save Changes' : 'Create IP Right'}</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
