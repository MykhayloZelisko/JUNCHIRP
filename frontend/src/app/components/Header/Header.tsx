'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/shared/components/Button/Button';
import styles from './Header.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import authSelector from '@/redux/auth/authSelector';
import { useAppSelector } from '@/hooks/reduxHooks';
import BurgerMenu from '@/app/components/Header/BurgerMenu/BurgerMenu';
import { ReactElement } from 'react';

export default function Header(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(authSelector.selectUser);
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const isAuthPage =
    pathname === '/auth/login' ||
    pathname === '/auth/registration' ||
    pathname === '/confirm-email' ||
    pathname === '/verify-email';

  const login = (): void => {
    router.push('/auth/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <Link className={styles.header__link} href="/">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={134}
            height={76}
            priority
          />
        </Link>
        {loadingStatus !== 'loaded'
          ? null
          : !isAuthPage && (
              <>
                {user?.isVerified ? (
                  <BurgerMenu />
                ) : (
                  <Button
                    color="green"
                    variant="secondary-frame"
                    onClick={login}
                  >
                    Увійти
                  </Button>
                )}
              </>
            )}
      </div>
    </header>
  );
}
