'use client';

import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './HardSkillForm.module.scss';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import { useAddHardSkillMutation } from '@/api/hardSkillsApi';

const schema = z.object({
  hardSkillName: z
    .string()
    .trim()
    .nonempty('Поле не може бути порожнім')
    .min(2, 'Введи Hard Skill від 2 до 50 символів')
    .max(50, 'Введи Hard Skill від 2 до 50 символів')
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'\-+_/]+$/,
      'Недопустимі символи в назві',
    ),
});

type FormData = z.infer<typeof schema>;

interface SoftSkillFormProps {
  onCancel: () => void;
}

export default function HardSkillForm(props: SoftSkillFormProps): ReactElement {
  const [addHardSkill, { isLoading }] = useAddHardSkillMutation();
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
    const result = await addHardSkill(data);
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
      className={styles['hard-skill-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['hard-skill-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          {...register('hardSkillName')}
          label="Хард скіл"
          placeholder="JavaScript, Figma, SQL..."
          withError
          errorMessages={
            errors.hardSkillName?.message && [errors.hardSkillName.message]
          }
        />
      </fieldset>
      <Button type="submit" fullWidth color="green" disabled={!isValid}>
        Зберегти
      </Button>
    </form>
  );
}
