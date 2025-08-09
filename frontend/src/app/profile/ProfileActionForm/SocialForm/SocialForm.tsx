'use client';

import { useEffect, ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import SocialAutocomplete from '@/shared/components/SocialAutocomplete/SocialAutocomplete';
import styles from './SocialForm.module.scss';
import { socialNetworks } from '@/shared/constants/social-networks';
import {
  ClientSocialInterface,
  SocialInterface,
} from '@/shared/interfaces/social.interface';
import {
  useAddSocialMutation,
  useUpdateSocialMutation,
} from '@/api/socialsApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';

const schema = z
  .object({
    network: z
      .string()
      .trim()
      .nonempty('Поле не може бути порожнім')
      .min(2, 'Назва повинна містити від 2 до 50 символів')
      .max(50, 'Назва повинна містити від 2 до 50 символів')
      .regex(/^[a-zA-Zа-яА-ЯґҐїЇєЄ' -]+$/, 'Некоректна назва соцмережі'),
    url: z
      .string()
      .trim()
      .nonempty('Поле не може бути порожнім')
      .min(10, 'Урл повинен містити від 10 до 255 символів')
      .max(255, 'Урл повинен містити від 10 до 255 символів')
      .regex(/^https:\/\/.+$/, 'Некоректне посилання'),
  })
  .superRefine(({ network, url }, ctx) => {
    const match = socialNetworks.find(
      (item) => item.network.toLowerCase() === network.toLowerCase(),
    );

    if (!match) {
      return;
    }

    if (
      !url.startsWith(match.url) ||
      (match.urlRegex && !match.urlRegex.test(url))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Некоректне посилання',
        path: ['url'],
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface SocialFormProps {
  initialValues?: SocialInterface;
  onCancel: () => void;
}

export default function SocialForm(props: SocialFormProps): ReactElement {
  const [updateSocial, { isLoading: updateSocialLoading }] =
    useUpdateSocialMutation();
  const [addSocial, { isLoading: addSocialLoading }] = useAddSocialMutation();
  const toast = useToast();
  const { initialValues, onCancel } = props;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      network: '',
      url: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        network: initialValues.network,
        url: initialValues.url,
      });
    } else {
      reset({
        network: '',
        url: '',
      });
    }
  }, [initialValues, reset]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'network') {
        trigger('url');
      }
    });
    return (): void => subscription.unsubscribe();
  }, [watch, trigger]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (initialValues) {
      const result = await updateSocial({ id: initialValues.id, data });

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
            summary: 'Ця соцмережа вже додана.',
            life: 3000,
          });
          return;
        }
        return;
      }
    } else {
      const result = await addSocial(data);

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
            summary: 'Ця соцмережа вже додана.',
            life: 3000,
          });
          return;
        }
        return;
      }
    }
    onCancel();
  };

  const handleSelectSocial = (match: ClientSocialInterface | null): void => {
    if (match && !getValues('url')) {
      setValue('url', match.url, { shouldValidate: true });
    }
  };

  return (
    <form className={styles['social-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className={styles['social-form__fieldset']}
        disabled={updateSocialLoading || addSocialLoading}
      >
        <Controller
          name="network"
          control={control}
          render={({ field }) => (
            <SocialAutocomplete
              {...field}
              label="Назва соцмережі"
              placeholder="Вкажи назву соцмережі"
              suggestions={socialNetworks}
              onSelectSocial={handleSelectSocial}
              errorMessages={
                errors.network?.message && [errors.network.message]
              }
              withError
            />
          )}
        />
        <Input
          {...register('url')}
          label="Посилання"
          placeholder="Встав посилання на свій профіль"
          withError
          errorMessages={errors.url?.message && [errors.url.message]}
        />
      </fieldset>

      {initialValues ? (
        <div className={styles['social-form__actions']}>
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
      ) : (
        <Button type="submit" fullWidth color="green" disabled={!isValid}>
          Зберегти
        </Button>
      )}
    </form>
  );
}
