import { useToastContext } from '@/providers/MessageProvider';
import { ToastMessage } from 'primereact/toast';

export const useToast = (): ((msg: ToastMessage | ToastMessage[]) => void) => {
  const { showToast } = useToastContext();
  return showToast;
};
