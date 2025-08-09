'use client';

import styles from './LoginForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/api/authApi';
import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { useToast } from '@/hooks/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useLazyGetProjectRolesListQuery } from '@/api/projectRolesApi';
import { useSupport } from '@/hooks/useSupport';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setEducations } from '@/redux/educations/educationsSlice';
import { setHardSkills } from '@/redux/hardSkills/hardSkillsSlice';
import { setSocials } from '@/redux/socials/socialsSlice';
import { setSoftSkills } from '@/redux/softSkills/softSkillsSlice';

const schema = z.object({
  email: z.string().trim().nonempty('Поле не може бути порожнім'),
  password: z.string().trim().nonempty('Поле не може бути порожнім'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const toast = useToast();
  const [loadRoles] = useLazyGetProjectRolesListQuery();
  const support = useSupport();
  const dispatch = useAppDispatch();

  const openDialog = (): void => {
    support();
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    const result = await login(data);

    if ('data' in result) {
      const user = result.data;
      dispatch(setEducations(user.educations));
      dispatch(setSoftSkills(user.softSkills));
      dispatch(setHardSkills(user.hardSkills));
      dispatch(setSocials(user.socials));
    }

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
            data: { attemptsCount: number };
          })
        | undefined;
      const status = errorData?.status;

      if (status === 429) {
        const attemptsCount = errorData?.data.attemptsCount ?? 0;

        let [summary, detail] = ['', <></>];
        if (attemptsCount === 15) {
          [summary, detail] = [
            'Твій обліковий запис заблоковано через невдалі спроби входу.',
            <p>
              Ти можеш повернути доступ до свого облікового запису звернувшись
              до нашої служби{' '}
              <Button
                className={styles['login-form__message-button']}
                variant="link"
                color="blue"
                onClick={openDialog}
              >
                підтримки
              </Button>
              .
            </p>,
          ];
        } else if (attemptsCount === 10) {
          [summary, detail] = [
            'Твій обліковий запис заблоковано через невдалі спроби входу.',
            <p>
              Ти можеш повернути доступ до свого облікового запису через 1
              годину. Якщо тобі потрібна допомога, звернись до нашої служби{' '}
              <Button
                className={styles['login-form__message-button']}
                variant="link"
                color="blue"
                onClick={openDialog}
              >
                підтримки
              </Button>
              .
            </p>,
          ];
        } else if (attemptsCount === 5) {
          [summary, detail] = [
            'Твій обліковий запис заблоковано через невдалі спроби входу.',
            <p>
              Ти можеш повернути доступ до свого облікового запису через 15
              хвилин. Якщо тобі потрібна допомога, звернись до нашої служби{' '}
              <Button
                className={styles['login-form__message-button']}
                variant="link"
                color="blue"
                onClick={openDialog}
              >
                підтримки
              </Button>
              .
            </p>,
          ];
        }
        toast({
          severity: 'error',
          summary,
          detail,
          life: 10000,
        });
        return;
      }

      if (status === 401) {
        toast({
          severity: 'error',
          summary: 'Схоже введено неправильну електронну пошту або пароль.',
          detail: 'Спробуй ще раз або віднови пароль.',
          life: 3000,
        });
        return;
      }

      toast({
        severity: 'error',
        summary: 'Виникла помилка під час входу.',
        detail: 'Спробуй пізніше.',
        life: 3000,
      });
      return;
    }

    const user: UserInterface = result.data;

    if (user.isVerified) {
      await loadRoles(undefined);
      router.push('/');
    } else {
      router.push('/confirm-email?type=login');
    }
  };

  return (
    <form
      noValidate
      className={styles['login-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className={styles['login-form__fieldset']} disabled={isLoading}>
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
        <Input
          label="Пароль"
          type="password"
          placeholder="Пароль"
          {...register('password')}
          withError
          errorMessages={errors.password?.message && [errors.password.message]}
        />
      </fieldset>
      <div className={styles['login-form__button-wrapper']}>
        <Button
          type="submit"
          size="md"
          color="green"
          fullWidth={true}
          loading={isLoading}
        >
          Увійти
        </Button>
        <Link
          className={styles['login-form__link']}
          href="/request-password-reset"
        >
          Забули пароль?
        </Link>
      </div>
    </form>
  );
}
