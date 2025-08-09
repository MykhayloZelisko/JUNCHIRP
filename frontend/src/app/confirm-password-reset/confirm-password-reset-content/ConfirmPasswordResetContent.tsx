'use client';

import { ReactElement } from 'react';
import styles from './ConfirmPasswordResetContent.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRequestPasswordResetMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';

export default function ConfirmPasswordResetContent(): ReactElement {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [reqResetPassword] = useRequestPasswordResetMutation();
  const toast = useToast();
  const router = useRouter();

  const handleClick = async (): Promise<void> => {
    const result = await reqResetPassword({ email });

    if ('error' in result) {
      const errorData = result.error as (
        | FetchBaseQueryError
        | SerializedError
      ) & {
        status?: number;
      };
      const status = errorData.status;
      if (status === 429) {
        toast({
          severity: 'error',
          summary:
            'Перевищено ліміт запитів на підтвердження електронної пошти.',
          detail: 'Будь ласка, спробуй надіслати новий запит через 1 годину.',
          life: 3000,
        });
      } else {
        toast({
          severity: 'error',
          summary: 'Помилка обробки запиту.',
          detail: 'Адресу електронної пошти не знайдено в базі даних.',
          life: 3000,
        });
        router.push('/request-password-reset');
      }
    }
  };

  return (
    <div className={styles['confirm-password-reset-content']}>
      <h2 className={styles['confirm-password-reset-content__title']}>
        Підтвердження запиту на відновлення пароля
      </h2>
      <div className={styles['confirm-password-reset-content__content']}>
        <p>
          Ми надіслали лист із посиланням для підтвердження запиту на
          відновлення пароля на {email}. Перевір свою поштову скриньку та
          натисни на посилання для підтвердження відновлення пароля.
        </p>
        <p>
          Якщо лист не надійшов, будь ласка, перевір папку "Спам" або{' '}
          <Button
            className={styles['confirm-password-reset-content__inline-button']}
            variant="link"
            color="green"
            onClick={handleClick}
          >
            Надішли запит ще раз.
          </Button>
        </p>
      </div>
      <div className={styles['confirm-password-reset-content__content']}>
        <h6 className={styles['confirm-password-reset-content__sub-title']}>
          Важлива інформація:
        </h6>
        <p>
          Термін дії посилання: Посилання на підтвердження відновлення пароля
          дійсне протягом 24 годин.
        </p>
        <p>
          Нове посилання анулює старе: Кожного разу, коли ти запитуєш нове
          посилання, попереднє стає недійсним. Це означає, що старе посилання
          більше не буде працювати, і тобі потрібно буде використати нове.
        </p>
        <p>
          По закінченні 24 годин: Якщо ти не підтвердиш свій запит протягом 24
          годин, він вважатиметься анульованим, і тобі потрібно буде почати
          процес відновлення пароля знову.
        </p>
      </div>
    </div>
  );
}
