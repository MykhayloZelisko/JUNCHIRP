'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  ReactElement,
} from 'react';
import SupportPopup from '@/shared/components/SupportPopup/SupportPopup';

interface SupportContextType {
  openSupport: () => void;
  closeSupport: () => void;
}

const SupportContext = createContext<SupportContextType | null>(null);

export const SupportProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const openSupport = useCallback(() => setIsOpen(true), []);
  const closeSupport = useCallback(() => setIsOpen(false), []);

  return (
    <SupportContext.Provider value={{ openSupport, closeSupport }}>
      {children}
      {isOpen && <SupportPopup onClose={closeSupport} />}
    </SupportContext.Provider>
  );
};

export const useSupportContext = (): SupportContextType => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupportContext must be used within SupportProvider');
  }
  return context;
};
