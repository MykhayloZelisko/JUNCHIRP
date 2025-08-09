'use client';

import { TabMenu } from 'primereact/tabmenu';
import React, { ReactElement } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function TabMenuWrapper(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    {
      label: 'Реєстрація',
      command: (): void => {
        router.push('/auth/registration');
      },
    },
    {
      label: 'Вхід',
      command: (): void => {
        router.push('/auth/login');
      },
    },
  ];

  const activeIndex = pathname.includes('login') ? 1 : 0;

  return (
    <TabMenu
      className={'tab-menu-wrapper'}
      model={items}
      activeIndex={activeIndex}
    />
  );
}
