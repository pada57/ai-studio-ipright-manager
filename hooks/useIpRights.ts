import { useState, useCallback } from 'react';
// FIX: Corrected import path for types.
import type { IpRight } from '../types';
// FIX: Corrected import path for db service.
import * as db from '../services/db';

const FAKE_USER = 'System User';

export const useIpRights = () => {
  const [ipRights, setIpRights] = useState<IpRight[]>(() => db.getIpRights());

  const updateAndPersist = (newIpRights: IpRight[]) => {
      setIpRights(newIpRights);
      db.saveIpRights(newIpRights);
  };

  const addIpRight = useCallback((ipRightData: Omit<IpRight, 'id' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'>) => {
    const now = new Date().toISOString();
    const newIpRight: IpRight = {
      ...ipRightData,
      id: `${ipRightData.country}-${ipRightData.name.replace(/\s+/g, '')}-${crypto.randomUUID().slice(0, 4)}`,
      createdBy: FAKE_USER,
      createdAt: now,
      lastModifiedBy: FAKE_USER,
      lastModifiedAt: now,
    };
    updateAndPersist([...ipRights, newIpRight]);
  }, [ipRights]);

  const updateIpRight = useCallback((updatedIpRight: IpRight) => {
     const newIpRightWithAudit = {
        ...updatedIpRight,
        lastModifiedBy: FAKE_USER,
        lastModifiedAt: new Date().toISOString(),
    };
    const newIpRights = ipRights.map(ip => (ip.id === newIpRightWithAudit.id ? newIpRightWithAudit : ip));
    updateAndPersist(newIpRights);
  }, [ipRights]);

  const deleteIpRight = useCallback((ipRightId: string) => {
    const newIpRights = ipRights.filter(ip => ip.id !== ipRightId);
    updateAndPersist(newIpRights);
  }, [ipRights]);

  const replaceAllIpRights = useCallback((newIpRights: IpRight[]) => {
    updateAndPersist(newIpRights);
  }, []);

  return { ipRights, addIpRight, updateIpRight, deleteIpRight, replaceAllIpRights };
};
