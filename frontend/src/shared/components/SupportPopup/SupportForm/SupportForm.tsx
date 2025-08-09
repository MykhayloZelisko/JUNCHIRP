'use client';

import { ReactElement, useEffect } from 'react';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './SupportForm.module.scss';
import Textarea from '@/shared/components/Textarea/Textarea';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { useSupportMutation } from '@/api/supportApi';
import { useToast } from '@/hooks/useToast';

const schema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Поле електронної пошти не може бути порожнім')
    .email('Некоректний формат електронної пошти')
    .regex(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])/, 'Некоректний формат електронної пошти')
    .refine((val) => !val.endsWith('.ru'), {
      message: `Домен '.ru' не підтримується. Вибери інший`,
    }),
  request: z
    .string()
    .trim()
    .min(10, 'Введи опис від 10 до 1000 символів')
    .max(1000, 'Введи опис від 10 до 1000 символів')
    .regex(
      /^[0-9a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ .,;:!?()\n\r-]+$/,
      'Недопустимі символи в описі',
    ),
});

type FormData = z.infer<typeof schema>;

interface SupportFormProps {
  user?: UserInterface | null;
  onClose: () => void;
}

export default function SupportForm(props: SupportFormProps): ReactElement {
  const [sendSupportRequest, { isLoading }] = useSupportMutation();
  const toast = useToast();
  const { user, onClose } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      request: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        request: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    const result = await sendSupportRequest(data);
    onClose();

    if ('data' in result) {
      toast({
        severity: 'success',
        summary: 'Запит надіслано!',
        detail: 'Ми відповімо тобі якнайшвидше.',
        life: 3000,
      });
    }

    if ('error' in result) {
      toast({
        severity: 'success',
        summary: 'Щось пішло не так.',
        detail: 'Спробуй надіслати запит пізніше.',
        life: 3000,
      });
    }
  };

  return (
    <form className={styles['support-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className={styles['support-form__fieldset']}
        disabled={isLoading}
      >
        <Textarea
          label="Опиши свій запит – чим детальніше, тим краще!"
          placeholder="Опиши свій запит – чим детальніше, тим краще!"
          {...register('request')}
          withError
          errorMessages={errors.request?.message && [errors.request.message]}
        />
      </fieldset>
      <div className={styles['support-form__button-wrapper']}>
        {!user && (
          <fieldset
            className={styles['support-form__fieldset']}
            disabled={isLoading}
          >
            <Input
              label="Email"
              placeholder="example@email.com"
              type="email"
              {...register('email')}
              withError
              errorMessages={errors.email?.message && [errors.email.message]}
            />
          </fieldset>
        )}
        <Button type="submit" color="green">
          Надіслати
        </Button>
      </div>
    </form>
  );
}
