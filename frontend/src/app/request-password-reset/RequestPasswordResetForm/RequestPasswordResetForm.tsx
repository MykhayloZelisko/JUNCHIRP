'use client';

import { ReactElement, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './RequestPasswordResetForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { useToast } from '@/hooks/useToast';
import { useRequestPasswordResetMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Поле не може бути порожнім')
    .email('Невірний формат e-mail')
    .regex(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])/, 'Невірний формат e-mail')
    .refine((val) => !val.endsWith('.ru'), {
      message: `Домен '.ru' не підтримується`,
    }),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FormData = z.infer<typeof schema>;

export default function RequestPasswordResetForm(): ReactElement {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const email = watch('email');
  const [reqResetPassword, { isLoading }] = useRequestPasswordResetMutation();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (
        !email ||
        (errors.email?.type !== 'manual' && !!errors.email?.message)
      ) {
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`,
        );
        if (!res.ok) {
          return;
        }
        const { isAvailable } = await res.json();

        if (isAvailable) {
          setError('email', {
            type: 'manual',
            message: 'Електронна пошта не знайдена',
          });
        } else {
          clearErrors('email');
        }
      } catch {
        return;
      }
    }, 500);

    return (): void => clearTimeout(timeout);
  }, [email, setError, clearErrors, errors.email?.type, errors.email?.message]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (errors.email?.message) {
      return;
    }

    const trimmedData = {
      email: data.email.trim(),
    };
    const result = await reqResetPassword(trimmedData);

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
            data: { attemptsCount: number };
          })
        | undefined;
      const status = errorData?.status;

      if (status === 429) {
        toast({
          severity: 'error',
          summary:
            'Перевищено ліміт запитів на підтвердження запиту на відновлення пароля.',
          detail: 'Будь ласка, спробуй надіслати новий запит через 1 годину.',
          life: 10000,
        });

        return;
      }

      toast({
        severity: 'error',
        summary: 'Невідома помилка.',
        detail: 'Спробуй пізніше.',
        life: 3000,
      });

      return;
    }

    router.push(`/confirm-password-reset?email=${encodeURIComponent(email)}`);
  };

  return (
    <form
      noValidate
      className={styles['request-password-reset-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset disabled={isLoading}>
        <Input
          label="Email"
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
      </fieldset>
      <Button color="green" type="submit" fullWidth loading={isLoading}>
        Відправити запит
      </Button>
    </form>
  );
}
