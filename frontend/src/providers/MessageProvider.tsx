'use client';

import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
} from 'react';
import { Toast, ToastMessage } from 'primereact/toast';

interface ToastContextType {
  showToast: (msg: ToastMessage | ToastMessage[]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function MessageProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const toastRef = useRef<Toast>(null);

  const showToast = (msg: ToastMessage | ToastMessage[]): void => {
    toastRef.current?.show(msg);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast className={'message-provider'} ref={toastRef} position="center" />
      {children}
    </ToastContext.Provider>
  );
}

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};
