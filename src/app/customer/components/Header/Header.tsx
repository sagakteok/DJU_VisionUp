'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    const mobile = useMediaQuery({ query: '(max-width: 700px)' });

    useEffect(() => {
        setIsMobile(mobile);
    }, [mobile]);

    return isMobile;
}

export default function Header() {
    const isMobile = useIsMobile();
    return isMobile ? <MobileHeader /> : <DesktopHeader />;
}