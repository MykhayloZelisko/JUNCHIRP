'use client';

import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './UserNameForm.module.scss';
import { useUpdateUserMutation } from '@/api/authApi';
import { UserInterface } from '@/shared/interfaces/user.interface';

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .nonempty('Поле імені не може бути порожнім')
    .min(2, `Ім'я повинно містити від 2 до 50 символів`)
    .max(50, `Ім'я повинно містити від 2 до 50 символів`)
    .regex(
      /^[a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ -]+$/,
      'Використовувати можна тільки літери, пробіли, апострофи та дефіси',
    ),
  lastName: z
    .string()
    .trim()
    .nonempty('Поле прізвища не може бути порожнім')
    .min(2, 'Прізвище повинно містити від 2 до 50 символів')
    .max(50, 'Прізвище повинно містити від 2 до 50 символів')
    .regex(
      /^[a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ -]+$/,
      'Використовувати можна тільки літери, пробіли, апострофи та дефіси',
    ),
});

type FormData = z.infer<typeof schema>;

interface UserNameFormProps {
  onCancel: () => void;
  initialValues: UserInterface;
}

export default function UserNameForm(props: UserNameFormProps): ReactElement {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { onCancel, initialValues } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
    },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    await updateUser(data);
    onCancel();
  };

  return (
    <form
      className={styles['user-name-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['user-name-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          {...register('firstName')}
          label="Ім'я"
          placeholder="Ім'я"
          withError
          errorMessages={
            errors.firstName?.message && [errors.firstName.message]
          }
        />
        <Input
          {...register('lastName')}
          label="Прізвище"
          placeholder="Прізвище"
          withError
          errorMessages={errors.lastName?.message && [errors.lastName.message]}
        />
      </fieldset>
      <div className={styles['user-name-form__actions']}>
        <Button
          type="button"
          variant="secondary-frame"
          color="green"
          onClick={onCancel}
        >
          Скасувати
        </Button>
        <Button type="submit" color="green" disabled={!isValid}>
          Зберегти
        </Button>
      </div>
    </form>
  );
}
