'use client';

import { ReactElement } from 'react';
import styles from './DeleteItemPopup.module.scss';
import Button from '@/shared/components/Button/Button';

interface DeleteItemPopupProps<T> {
  item: T;
  title: string;
  message: string;
  maxSize: number;
  count: number;
  onCancel: () => void;
  onConfirm: (item: T) => void;
}

export default function DeleteItemPopup<T>(
  props: DeleteItemPopupProps<T>,
): ReactElement {
  const { item, title, message, maxSize, count, onCancel, onConfirm } = props;

  return (
    <div className={styles['delete-item-popup__wrapper']}>
      <div className={styles['delete-item-popup']}>
        <div className={styles['delete-item-popup__content']}>
          <h3 className={styles['delete-item-popup__title']}>{title}</h3>
          <p className={styles['delete-item-popup__text']}>{message}</p>
          <p className={styles['delete-item-popup__counter']}>
            {count}{' '}
            <span className={styles['delete-item-popup__counter--gray']}>
              / {maxSize}
            </span>
          </p>
        </div>
        <div className={styles['delete-item-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onCancel}>
            Скасувати
          </Button>
          <Button color="green" onClick={() => onConfirm(item)}>
            Видалити
          </Button>
        </div>
      </div>
    </div>
  );
}
