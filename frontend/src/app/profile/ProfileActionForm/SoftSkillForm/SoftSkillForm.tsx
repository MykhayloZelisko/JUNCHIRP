'use client';

import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './SoftSkillForm.module.scss';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import { useAddSoftSkillMutation } from '@/api/softSkillsApi';

const schema = z.object({
  softSkillName: z
    .string()
    .trim()
    .nonempty('Поле не може бути порожнім')
    .min(2, 'Введи Soft Skill від 2 до 50 символів')
    .max(50, 'Введи Soft Skill від 2 до 50 символів')
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'\-+_/]+$/,
      'Недопустимі символи в назві',
    ),
});

type FormData = z.infer<typeof schema>;

interface SoftSkillFormProps {
  onCancel: () => void;
}

export default function SoftSkillForm(props: SoftSkillFormProps): ReactElement {
  const [addSoftSkill, { isLoading }] = useAddSoftSkillMutation();
  const toast = useToast();
  const { onCancel } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    const result = await addSoftSkill(data);
    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
          })
        | undefined;
      const status = errorData?.status;

      if (status === 409) {
        toast({
          severity: 'error',
          summary: 'Ця навичка вже додана.',
          life: 3000,
        });
        return;
      }
      return;
    }
    onCancel();
  };

  return (
    <form
      className={styles['soft-skill-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['soft-skill-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          {...register('softSkillName')}
          label="Софт скіл"
          placeholder="Командна робота, Тайм-менеджмент..."
          withError
          errorMessages={
            errors.softSkillName?.message && [errors.softSkillName.message]
          }
        />
      </fieldset>
      <Button type="submit" fullWidth color="green" disabled={!isValid}>
        Зберегти
      </Button>
    </form>
  );
}
