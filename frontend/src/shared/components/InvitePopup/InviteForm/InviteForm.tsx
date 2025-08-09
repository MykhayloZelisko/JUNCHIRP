'use client';

import { ReactElement } from 'react';
import styles from './InviteForm.module.scss';
import ProjectDropdown from '@/shared/components/ProjectDropdown/ProjectDropdown';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import myProjectsSelector from '@/redux/myProjects/myProjectsSelector';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProjectRoleDropdown from '@/shared/components/ProjectRoleDropdown/ProjectRoleDropdown';
import Button from '@/shared/components/Button/Button';
import { z } from 'zod';
import { useInviteUserMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';

const schema = z.object({
  projectId: z.string().nonempty('Поле не може бути порожнім'),
  projectRoleId: z.string().nonempty('Поле не може бути порожнім'),
  userId: z.string(),
});

type FormData = z.infer<typeof schema>;

interface InviteFormProps {
  user: UserCardInterface;
  onClose: () => void;
}

export default function InviteForm(props: InviteFormProps): ReactElement {
  const { user, onClose } = props;
  const myProjects = useAppSelector(myProjectsSelector.selectMyOwnedProjects);
  const [invite] = useInviteUserMutation();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      projectId: '',
      projectRoleId: '',
      userId: user.id,
    },
  });

  const selectedProjectId = useWatch({
    control,
    name: 'projectId',
  });
  const selectedProject = myProjects.find(
    (item) => item.id === selectedProjectId,
  );
  const roleOptions = selectedProject?.roles ?? [];
  const allowedRoleTypeIds = user.educations.map(
    (edu) => edu.specialization.id,
  );

  const onSubmit = async (data: FormData): Promise<void> => {
    const result = await invite(data);

    if ('data' in result) {
      onClose();
      toast({
        severity: 'success',
        summary: 'Запрошення надіслано.',
        life: 3000,
      });
    } else if ('error' in result) {
      toast({
        severity: 'error',
        summary: 'Не вдалося надіслати запрошення.',
        life: 3000,
      });
    }
  };

  return (
    <form className={styles['invite-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['invite-form__fieldset']}>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <ProjectDropdown
              {...field}
              options={myProjects}
              label="Проєкт"
              placeholder="Оберіть проєкт"
              onChange={(value) => {
                field.onChange(value);
                setValue('projectRoleId', '');
              }}
            />
          )}
        />
        <Controller
          name="projectRoleId"
          control={control}
          render={({ field }) => (
            <ProjectRoleDropdown
              {...field}
              options={roleOptions}
              label="Роль"
              placeholder={
                selectedProject ? 'Оберіть роль' : 'Спочатку оберіть проєкт'
              }
              disabled={!selectedProject}
              allowedRoleTypeIds={allowedRoleTypeIds}
            />
          )}
        />
      </fieldset>
      <div className={styles['invite-form__actions']}>
        <Button color="green" variant={'secondary-frame'} onClick={onClose}>
          Скасувати
        </Button>
        <Button type="submit" color="green" disabled={!isValid}>
          Запросити
        </Button>
      </div>
    </form>
  );
}
