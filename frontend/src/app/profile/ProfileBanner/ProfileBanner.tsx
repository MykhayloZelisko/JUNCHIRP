'use client';

import { ReactElement, useEffect } from 'react';
import styles from './ProfileBanner.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

interface ProfileBannerProps {
  closeBanner: () => void;
}

export default function ProfileBanner(props: ProfileBannerProps): ReactElement {
  const { closeBanner } = props;
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'discord_auth_failed') {
      toast({
        severity: 'error',
        summary: 'Не вдалося підтврдити Discord',
        detail: 'Спробуй ще раз.',
        life: 3000,
      });
    }
  }, [searchParams, toast]);

  const handleDiscordLogin = (): void => {
    const currentPath = window.location.pathname;
    const returnUrl = encodeURIComponent(currentPath);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${baseUrl}/auth/discord?returnUrl=${returnUrl}`;
  };

  return (
    <div className={styles['profile-banner']}>
      <Image
        src="./images/bird-2.svg"
        alt="bird"
        width={420}
        height={223}
        priority
      />
      <p className={styles['profile-banner__text']}>
        Підключи Discord, щоб мати змогу приєднуватися до проектів та отримати
        доступ до проєктних чатів.
      </p>
      <Button color="green" onClick={handleDiscordLogin}>
        Підключити
      </Button>
      <Button
        className={styles['profile-banner__close']}
        icon={<X />}
        variant="link"
        color="black"
        size="md"
        onClick={closeBanner}
      />
    </div>
  );
}
