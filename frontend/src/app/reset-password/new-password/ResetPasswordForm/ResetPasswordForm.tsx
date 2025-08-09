'use client';

import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import styles from './ResetPasswordForm.module.scss';
import Button from '@/shared/components/Button/Button';
import Input from '@/shared/components/Input/Input';
import PasswordStrengthIndicator from '@/shared/components/PasswordStrengthIndicator/PasswordStrengthIndicator';
import { z, ZodEffects, ZodObject, ZodString } from 'zod';
import { blackListPasswords } from '@/shared/constants/black-list-passwords';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPasswordStrength } from '@/shared/utils/getPasswordStrength';
import {
  useCancelResetPasswordMutation,
  useResetPasswordMutation,
} from '@/api/authApi';
import { useToast } from '@/hooks/useToast';
import CancelPasswordPopup from './CancelPasswordPopup/CancelPasswordPopup';

const baseSchema = z.object({
  password: z
    .string()
    .nonempty('Поле не може бути порожнім')
    .min(8, 'Пароль має містити 8–20 символів')
    .max(20, 'Пароль має містити 8–20 символів')
    .refine(
      (val) => /^[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+$/.test(val),
      { message: 'Використовуй лише латиницю, цифри та спецсимволи' },
    ),
  confirmPassword: z.string().nonempty('Поле не може бути порожнім'),
});

type FormData = z.infer<typeof baseSchema>;

const createSchemaWithContext = (
  firstName: string,
  lastName: string,
): ZodEffects<
  ZodObject<{
    password: ZodEffects<ZodString, string, string>;
    confirmPassword: ZodString;
  }>
> =>
  baseSchema.superRefine(({ password, confirmPassword }, ctx) => {
    if (password.includes(firstName) && firstName.length) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: `Пароль не може містити твоє ім’я чи прізвище`,
      });
    }

    if (password.includes(lastName) && lastName.length) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: `Пароль не може містити твоє ім’я чи прізвище`,
      });
    }

    if (blackListPasswords.includes(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Уникай очевидних паролів, як-от Password1',
      });
    }

    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Паролі не збігаються',
      });
    }
  });

export default function ResetPasswordForm(): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const firstName = searchParams.get('firstName') ?? '';
  const lastName = searchParams.get('lastName') ?? '';
  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();
  const [cancelResetPassword, { isLoading: isCancelLoading }] =
    useCancelResetPasswordMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  const schema = useMemo(
    () => createSchemaWithContext(firstName, lastName),
    [firstName, lastName],
  );

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const password = watch('password');
  const passwordStrength = getPasswordStrength(
    password,
    firstName,
    lastName,
    blackListPasswords,
  );

  useEffect(() => {
    if (dirtyFields.confirmPassword || dirtyFields.password) {
      trigger();
    }
  }, [password, trigger, dirtyFields.confirmPassword, dirtyFields.password]);

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  const onSubmit = async (data: FormData): Promise<void> => {
    const result = await resetPassword({ token, password: data.password });

    if ('error' in result) {
      toast({
        severity: 'error',
        summary: 'Виникла помилка при збереженні нового пароля.',
        detail:
          'Спробуй ще раз або звернись до підтримки, якщо проблема повторюється.',
        life: 3000,
      });
      return;
    }

    toast({
      severity: 'success',
      summary: 'Пароль успішно збережено!',
      detail: 'Тепер ти можеш увійти з новим паролем.',
      life: 3000,
    });
    router.push('/auth/login');
  };

  const cancelReset = async (): Promise<void> => {
    await cancelResetPassword(encodeURIComponent(token));
    toast({
      severity: 'success',
      summary: 'Відновлення пароля скасовано.',
      detail: 'Усі внесені зміни видалено.',
      life: 3000,
    });
    router.push('/auth/login');
  };

  return (
    <>
      <form
        className={styles['reset-password-form']}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={styles['reset-password-form__fieldset']}
          disabled={isResetLoading || isCancelLoading}
        >
          <Input
            autoComplete="new-password"
            label="Пароль"
            placeholder="Пароль"
            type="password"
            {...register('password')}
            withError
            errorMessages={
              errors.password &&
              (dirtyFields.password || isSubmitted) &&
              errors.password.message
                ? [errors.password.message]
                : undefined
            }
          />
          <PasswordStrengthIndicator strength={passwordStrength} />
          <Input
            label="Повторити пароль"
            placeholder="Повторити пароль"
            type="password"
            {...register('confirmPassword')}
            withError
            errorMessages={
              errors.confirmPassword &&
              (dirtyFields.confirmPassword || isSubmitted) &&
              errors.confirmPassword.message
                ? [errors.confirmPassword.message]
                : undefined
            }
          />
        </fieldset>
        <div className={styles['reset-password-form__buttons']}>
          <Button
            type="button"
            color="green"
            variant="secondary-frame"
            onClick={openModal}
          >
            Скасувати
          </Button>
          <Button type="submit" color="green">
            Зберегти пароль
          </Button>
        </div>
      </form>
      {isModalOpen && (
        <CancelPasswordPopup onConfirm={cancelReset} onCancel={closeModal} />
      )}
    </>
  );
}
