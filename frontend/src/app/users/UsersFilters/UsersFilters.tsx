'use client';

import { ReactElement } from 'react';
import styles from './UsersFilters.module.scss';
import UsersFiltersForm from './UsersFiltersForm/UsersFiltersForm';

export default function UsersFilters(): ReactElement {
  return (
    <div className={styles['users-filters']}>
      <h3 className={styles['users-filters__title']}>Фільтр учасників:</h3>
      <UsersFiltersForm />
      <div className={styles['users-filters__border']}></div>
    </div>
  );
}
