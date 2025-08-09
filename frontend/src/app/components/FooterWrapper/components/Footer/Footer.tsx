'use client';

import { useRouter } from 'next/navigation';
import styles from './Footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import Linkedin from '@/assets/icons/linkedin.svg';
import React, { ReactElement } from 'react';
import { useSupport } from '@/hooks/useSupport';

export default function Footer(): ReactElement {
  const router = useRouter();
  const support = useSupport();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goAbout = (): void => {
    router.push('/about');
  };

  const goLinkedin = (): void => {
    window.location.href = 'https://www.linkedin.com/company/jun-chirp';
  };

  const openDialog = (): void => {
    support();
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <a
          className={styles['footer__top-link']}
          href=""
          onClick={(e) => handleClick(e)}
        >
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={300}
            height={176}
            priority
          />
        </a>
        <div className={styles.footer__content}>
          <div className={styles.footer__buttons}>
            <Button color="green" variant="secondary-footer" onClick={goAbout}>
              Про нас
            </Button>
            <Button
              color="green"
              variant="secondary-footer"
              icon={<Linkedin />}
              onClick={goLinkedin}
            ></Button>
            <Button
              color="green"
              variant="secondary-footer"
              onClick={openDialog}
            >
              Підтримка
            </Button>
          </div>
          <div className={styles.footer__links}>
            <Link className={styles.footer__link} href="/privacy-policy">
              Політика конфіденційності
            </Link>
            <Link className={styles.footer__link} href="/legal-terms">
              Умови використання
            </Link>
            <span className={styles.footer__copyright}>&#169; 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
