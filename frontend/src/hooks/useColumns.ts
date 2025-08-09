import { useEffect, useState } from 'react';

export function useColumns(options?: {
  fixed?: number;
  breakpoint?: number;
}): number {
  const { fixed, breakpoint = 0 } = options ?? {};
  const [columns, setColumns] = useState<number>(fixed ?? 1);

  useEffect(() => {
    if (fixed !== undefined) {
      return;
    }

    const handleResize = (): void => {
      setColumns(window.innerWidth >= breakpoint ? 2 : 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, [fixed, breakpoint]);

  return columns;
}
