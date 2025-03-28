'use client';

import { useEffect, useState } from 'react';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    const handler = () => setIsMobile(media.matches);
    handler();
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}