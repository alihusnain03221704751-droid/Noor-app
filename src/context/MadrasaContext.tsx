import React, { createContext, useContext, useState, useEffect } from 'react';
import { Madrasa } from '../types';
import { INITIAL_MADRASAS } from '../data/madrasasData';
import { useAuth } from './AuthContext';

interface MadrasaContextType {
  madrasas: Madrasa[];
  approvedMadrasas: Madrasa[];
  pendingMadrasas: Madrasa[];
  rejectedMadrasas: Madrasa[];
  getMadrasaById: (id: string) => Madrasa | undefined;
  submitMadrasa: (data: Omit<Madrasa, 'id' | 'status'>) => { success: boolean; id: string; status: 'approved' | 'pending' };
  updateMadrasa: (id: string, updates: Partial<Madrasa>) => boolean;
  approveMadrasa: (id: string) => boolean;
  rejectMadrasa: (id: string, reason?: string) => boolean;
  deleteMadrasa: (id: string) => boolean;
  resetToDefaults: () => void;
  exportMadrasasJson: () => string;
  importMadrasasJson: (jsonString: string) => boolean;
}

const MadrasaContext = createContext<MadrasaContextType | undefined>(undefined);

const STORAGE_KEY = 'noor_madrasas_v1';

export const MadrasaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [madrasas, setMadrasas] = useState<Madrasa[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored madrasas, falling back to default', e);
    }
    return INITIAL_MADRASAS;
  });

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(madrasas));
    } catch (e) {
      console.error('Failed to persist madrasas to localStorage', e);
    }
  }, [madrasas]);

  const approvedMadrasas = madrasas.filter((m) => m.status === 'approved');
  const pendingMadrasas = madrasas.filter((m) => m.status === 'pending');
  const rejectedMadrasas = madrasas.filter((m) => m.status === 'rejected');

  const getMadrasaById = (id: string) => {
    return madrasas.find((m) => m.id === id);
  };

  const submitMadrasa = (data: Omit<Madrasa, 'id' | 'status'>) => {
    const isAdmin = user?.role === 'admin';
    const newId = `madrasa-${Date.now()}`;
    const status: 'approved' | 'pending' = isAdmin ? 'approved' : 'pending';

    const newMadrasa: Madrasa = {
      ...data,
      id: newId,
      status,
      submittedBy: {
        name: user?.name || data.submittedBy?.name || 'Community Member',
        email: user?.email || data.submittedBy?.email || 'applicant@noorislamic.app',
        timestamp: new Date().toISOString()
      },
      verifiedBy: isAdmin ? user?.email : undefined,
      verifiedAt: isAdmin ? new Date().toISOString() : undefined
    };

    setMadrasas((prev) => [newMadrasa, ...prev]);
    return { success: true, id: newId, status };
  };

  const updateMadrasa = (id: string, updates: Partial<Madrasa>) => {
    setMadrasas((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updates,
            id // preserve original id
          };
        }
        return item;
      })
    );
    return true;
  };

  const approveMadrasa = (id: string) => {
    setMadrasas((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'approved',
            verifiedBy: user?.email || 'alihusnain03221704751@gmail.com',
            verifiedAt: new Date().toISOString(),
            rejectionReason: undefined
          };
        }
        return item;
      })
    );
    return true;
  };

  const rejectMadrasa = (id: string, reason?: string) => {
    setMadrasas((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'rejected',
            rejectionReason: reason || 'Application requires additional documentation or physical verification.',
            verifiedBy: user?.email || 'alihusnain03221704751@gmail.com',
            verifiedAt: new Date().toISOString()
          };
        }
        return item;
      })
    );
    return true;
  };

  const deleteMadrasa = (id: string) => {
    setMadrasas((prev) => prev.filter((item) => item.id !== id));
    return true;
  };

  const resetToDefaults = () => {
    setMadrasas(INITIAL_MADRASAS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MADRASAS));
  };

  const exportMadrasasJson = () => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        total: madrasas.length,
        version: '1.0',
        madrasas
      },
      null,
      2
    );
  };

  const importMadrasasJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const list = Array.isArray(parsed) ? parsed : parsed.madrasas;
      if (Array.isArray(list) && list.length > 0) {
        setMadrasas(list);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON imported', e);
      return false;
    }
  };

  return (
    <MadrasaContext.Provider
      value={{
        madrasas,
        approvedMadrasas,
        pendingMadrasas,
        rejectedMadrasas,
        getMadrasaById,
        submitMadrasa,
        updateMadrasa,
        approveMadrasa,
        rejectMadrasa,
        deleteMadrasa,
        resetToDefaults,
        exportMadrasasJson,
        importMadrasasJson
      }}
    >
      {children}
    </MadrasaContext.Provider>
  );
};

export const useMadrasas = () => {
  const context = useContext(MadrasaContext);
  if (!context) {
    throw new Error('useMadrasas must be used within a MadrasaProvider');
  }
  return context;
};
