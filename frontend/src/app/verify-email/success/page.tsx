'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function Success(): ReactElement {
  const router = useRouter();

  const handleLogin = (): void => router.push('/auth/login');

  return (
    <VerificationResultContent
      title="Вітаємо"
      titleType="success"
      button={
        <Button color="green" onClick={handleLogin}>
          Увійти
        </Button>
      }
      content={
        <div>
          <p>Реєстрація завершена, Е-mail успішно підтверджено!</p>
          <p>Тепер ти можеш увійти в систему.</p>
        </div>
      }
    />
  );
}
