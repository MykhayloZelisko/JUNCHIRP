'use client';

import { ReactElement, useState } from 'react';
import Button from '@/shared/components/Button/Button';
import styles from './ConfirmEmailContent.module.scss';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useSendConfirmationEmailMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import ChangeEmailPopup from './ChangeEmailPopup/ChangeEmailPopup';

export default function ConfirmEmailContent(): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const searchParams = useSearchParams();
  const authType = searchParams.get('type');
  const toast = useToast();
  const [sendEmail] = useSendConfirmationEmailMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  const sendConfirmationRequest = async (): Promise<void> => {
    const result = await sendEmail({ email: user?.email ?? '' });

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & { status: number })
        | undefined;
      const status = errorData?.status;
      if (status === 429) {
        toast({
          severity: 'error',
          summary:
            'Перевищено ліміт запитів на підтвердження електронної пошти.',
          detail: 'Будь ласка, спробуй надіслати новий запит через 1 годину.',
          life: 3000,
        });
      } else if (status === 404) {
        toast({
          severity: 'error',
          summary: 'Виникла помилка при обробці запиту.',
          detail: 'Email вже підтверджений.',
          life: 3000,
        });
      }
    }
  };

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  return (
    <>
      <div className={styles['confirm-email-content']}>
        <h2 className={styles['confirm-email-content__title']}>
          Підтвердження електронної пошти
        </h2>
        <div className={styles['confirm-email-content__content']}>
          {authType === 'registration' ? (
            <p>
              Ми надіслали лист із посиланням для підтвердження на{' '}
              {user?.email ?? ''}. Перевір свою поштову скриньку та натисни на
              посилання для підтвердження реєстрації.
            </p>
          ) : (
            <p>
              Ти ще не підтвердив свою електронну пошту. Щоб завершити
              реєстрацію,{' '}
              <Button
                className={styles['confirm-email-content__inline-button']}
                variant="link"
                color="green"
                onClick={sendConfirmationRequest}
              >
                натисни тут
              </Button>{' '}
              - ми надішлемо лист із посиланням для підтвердження.
            </p>
          )}
          <p>
            Якщо лист не надійшов, будь ласка, перевір папку "Спам" або{' '}
            <Button
              className={styles['confirm-email-content__inline-button']}
              variant="link"
              color="green"
              onClick={sendConfirmationRequest}
            >
              Надішли запит ще раз.
            </Button>
          </p>
        </div>
        <div className={styles['confirm-email-content__content']}>
          <h6 className={styles['confirm-email-content__sub-title']}>
            Важлива інформація:
          </h6>
          <p>
            Термін дії посилання: Посилання на підтвердження електронної пошти
            дійсне протягом 24 годин.
          </p>
          <p>
            Нове посилання анулює старе: Кожного разу, коли ти запитуєш нове
            посилання, попереднє стає недійсним. Це означає, що старе посилання
            більше не буде працювати, і тобі потрібно буде використати нове.
          </p>
          <p>
            По закінченні 24 годин: Якщо ти не підтвердиш свою електронну пошту
            протягом 24 годин, твої дані будуть видалені з нашої бази даних, і
            тобі потрібно буде почати процес реєстрації знову.
          </p>
        </div>
        <Button color="green" onClick={openModal}>
          Ввести інший e-mail
        </Button>
      </div>
      {isModalOpen && <ChangeEmailPopup onClose={closeModal} />}
    </>
  );
}
