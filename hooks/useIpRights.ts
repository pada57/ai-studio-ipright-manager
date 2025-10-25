
import { useState, useCallback, useEffect } from 'react';
import type { IpRight } from '../types';
import * as db from '../services/db';

const FAKE_USER = 'System User';

export const useIpRights = () => {
  const [ipRights, setIpRights] = useState<IpRight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getIpRights().then(initialIpRights => {
        setIpRights(initialIpRights);
        setLoading(false);
    });
  }, []);


  const updateAndPersist = (newIpRights: IpRight[]) => {
      setIpRights(newIpRights);
      db.saveIpRights(newIpRights);
  };

  const addIpRight = useCallback((ipRightData: Omit<IpRight, 'id' | 'createdBy' | 'createdAt' | 'lastModifiedBy' | 'lastModifiedAt'>) => {
    setIpRights(prevIpRights => {
        const now = new Date().toISOString();
        const newIpRight: IpRight = {
          ...ipRightData,
          id: `${ipRightData.country}-${ipRightData.name.replace(/\s+/g, '')}-${crypto.randomUUID().slice(0, 4)}`,
          createdBy: FAKE_USER,
          createdAt: now,
          lastModifiedBy: FAKE_USER,
          lastModifiedAt: now,
        };
        const updatedIpRights = [...prevIpRights, newIpRight];
        updateAndPersist(updatedIpRights);
        return updatedIpRights;
    });
  }, []);

  const updateIpRight = useCallback((updatedIpRight: IpRight) => {
     setIpRights(prevIpRights => {
        const newIpRightWithAudit = {
            ...updatedIpRight,
            lastModifiedBy: FAKE_USER,
            lastModifiedAt: new Date().toISOString(),
        };
        const newIpRights = prevIpRights.map(ip => (ip.id === newIpRightWithAudit.id ? newIpRightWithAudit : ip));
        updateAndPersist(newIpRights);
        return newIpRights;
     });
  }, []);

  const deleteIpRight = useCallback((ipRightId: string) => {
    setIpRights(prevIpRights => {
        const newIpRights = prevIpRights.filter(ip => ip.id !== ipRightId);
        updateAndPersist(newIpRights);
        return newIpRights;
    });
  }, []);

  const replaceAllIpRights = useCallback((newIpRights: IpRight[]) => {
    updateAndPersist(newIpRights);
  }, []);

  return { ipRights, addIpRight, updateIpRight, deleteIpRight, replaceAllIpRights, loading };
};
