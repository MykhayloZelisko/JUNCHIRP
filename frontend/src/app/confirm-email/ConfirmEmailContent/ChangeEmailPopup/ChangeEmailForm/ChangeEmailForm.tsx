import React, { ReactElement, useEffect } from 'react';
import Input from '@/shared/components/Input/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { useUpdateUserMutation } from '@/api/authApi';
import styles from './ChangeEmailForm.module.scss';
import Button from '@/shared/components/Button/Button';

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

interface FormProps {
  onClose: () => void;
}

export default function ChangeEmailForm({ onClose }: FormProps): ReactElement {
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

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const toast = useToast();

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

        if (!isAvailable) {
          setError('email', {
            type: 'manual',
            message: 'Цей e-mail вже використовується',
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
    const result = await updateUser(trimmedData);

    if ('data' in result) {
      toast({
        severity: 'success',
        summary: 'E-mail змінено успішно.',
        detail: 'Перевір пошту для підтвердження.',
        life: 3000,
      });
    } else if ('error' in result) {
      toast({
        severity: 'error',
        summary: 'Помилка: не вдалося змінити e-mail.',
        detail: 'Спробуй ще раз.',
        life: 3000,
      });
    }

    onClose();
  };

  return (
    <form
      noValidate
      className={styles['change-email-form']}
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
      <div className={styles['change-email-form__buttons']}>
        <Button
          color="green"
          variant="secondary-frame"
          type="button"
          fullWidth
          onClick={onClose}
        >
          Назад
        </Button>
        <Button color="green" type="submit" fullWidth>
          Змінити e-mail
        </Button>
      </div>
    </form>
  );
}
