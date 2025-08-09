'use client';

import { ReactElement } from 'react';
import authSelector from '@/redux/auth/authSelector';
import styles from './SupportPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { useAppSelector } from '@/hooks/reduxHooks';

interface SupportPopupProps {
  onClose: () => void;
}

export default function SupportPopup(props: SupportPopupProps): ReactElement {
  const { onClose } = props;
  const user = useAppSelector(authSelector.selectUser);

  return (
    <div className={styles['support-popup__wrapper']}>
      <div className={styles['support-popup']}>

      </div>
    </div>
  );
}
