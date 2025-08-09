import { ReactElement } from 'react';
import styles from './CancelPasswordPopup.module.scss';
import Button from '@/shared/components/Button/Button';

interface CancelPasswordPopupProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelPasswordPopup({
  onCancel,
  onConfirm,
}: CancelPasswordPopupProps): ReactElement {
  return (
    <div className={styles['cancel-password-popup__wrapper']}>
      <div className={styles['cancel-password-popup']}>
        <h3 className={styles['cancel-password-popup__title']}>
          Скасувати відновлення пароля?
        </h3>
        <div className={styles['cancel-password-popup__buttons']}>
          <Button color="red" variant="secondary-frame" onClick={onCancel}>
            Ні, залишитися
          </Button>
          <Button color="green" onClick={onConfirm}>
            Так, скасувати
          </Button>
        </div>
      </div>
    </div>
  );
}
