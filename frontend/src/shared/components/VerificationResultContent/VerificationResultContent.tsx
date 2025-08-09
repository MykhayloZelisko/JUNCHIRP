'use client';

import { ReactElement, ReactNode } from 'react';
import styles from './VerificationResultContent.module.scss';

interface VerificationResultContentProps {
  title: string;
  titleType?: 'error' | 'success';
  content?: ReactNode;
  button?: ReactElement;
}

export default function VerificationResultContent({
  title,
  titleType = 'error',
  content = <></>,
  button,
}: VerificationResultContentProps): ReactElement {
  return (
    <div className={styles['verification-result-content']}>
      <h2
        className={`${styles['verification-result-content__title']} ${titleType === 'error' ? styles['verification-result-content__title--error'] : styles['verification-result-content__title--success']}`}
      >
        {title}
      </h2>
      {content}
      <>{button ?? null}</>
    </div>
  );
}
