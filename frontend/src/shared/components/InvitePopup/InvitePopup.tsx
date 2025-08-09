'use client';

import { ReactElement } from 'react';
import styles from './InvitePopup.module.scss';
import InviteForm from '@/shared/components/InvitePopup/InviteForm/InviteForm';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

interface InvitePopupProps {
  user: UserCardInterface;
  onClose: () => void;
}

export default function InvitePopup(props: InvitePopupProps): ReactElement {
  const { onClose, user } = props;

  return (
    <div className={styles['invite-popup__wrapper']}>
      <div className={styles['invite-popup']}>
        <h3 className={styles['invite-popup__title']}>Запросити в проєкт</h3>
        <InviteForm onClose={onClose} user={user} />
      </div>
    </div>
  );
}
