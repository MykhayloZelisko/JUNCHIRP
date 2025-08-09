'use client';

import Frame1 from '@/assets/icons/state=01.svg';
import Frame2 from '@/assets/icons/state=02.svg';
import Frame3 from '@/assets/icons/state=03.svg';
import Frame4 from '@/assets/icons/state=04.svg';
import Frame5 from '@/assets/icons/state=05.svg';
import Frame6 from '@/assets/icons/state=06.svg';
import Frame7 from '@/assets/icons/state=07.svg';
import Frame8 from '@/assets/icons/state=08.svg';
import { ReactElement, useEffect, useState } from 'react';

interface SpinnerProps {
  size?: number;
}

const frames = [Frame1, Frame2, Frame3, Frame4, Frame5, Frame6, Frame7, Frame8];

export default function Spinner({ size = 24 }: SpinnerProps): ReactElement {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 100);

    return (): void => clearInterval(interval);
  }, []);

  const CurrentFrame = frames[frameIndex];

  return <CurrentFrame width={size} height={size} />;
}
