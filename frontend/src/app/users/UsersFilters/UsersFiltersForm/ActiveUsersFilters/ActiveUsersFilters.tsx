'use client';

import { ReactElement } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import Button from '@/shared/components/Button/Button';
import styles from './ActiveUsersFilters.module.scss';
import X from '@/assets/icons/x.svg';

interface FormData {
  specializationIds: string[];
  activeProjectsCount: number | null;
}

interface ActiveUsersFiltersProps {
  form: UseFormReturn<FormData, unknown, FormData>;
  specializationsList: ProjectRoleTypeInterface[];
}

export default function ActiveUsersFilters({
  form,
  specializationsList,
}: ActiveUsersFiltersProps): ReactElement {
  const values = form.watch();

  const selectedSpecializations = values.specializationIds.map((id) =>
    specializationsList.find((item) => item.id === id),
  );

  const removeSpecialization = (idToRemove: string): void => {
    const current = form.getValues('specializationIds');
    const updated = current.filter((id) => id !== idToRemove);
    form.setValue('specializationIds', updated);
  };

  return (
    <div className={styles['active-users-filters']}>
      <Button
        color="green"
        variant="link"
        onClick={() =>
          form.reset({
            specializationIds: [],
            activeProjectsCount: null,
          })
        }
      >
        Очистити всі фільтри
      </Button>
      {selectedSpecializations.map((spec) =>
        spec ? (
          <div className={styles['active-users-filters__item']} key={spec.id}>
            <Button
              color="gray"
              variant="link"
              size="md"
              onClick={() => removeSpecialization(spec.id)}
              icon={<X />}
            />
            {spec.roleName}
          </div>
        ) : null,
      )}

      {values.activeProjectsCount !== null && (
        <div className={styles['active-users-filters__item']}>
          <Button
            color="gray"
            variant="link"
            size="md"
            onClick={() => form.setValue('activeProjectsCount', null)}
            icon={<X />}
          />
          {values.activeProjectsCount}
        </div>
      )}
    </div>
  );
}
