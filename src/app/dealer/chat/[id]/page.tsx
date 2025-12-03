'use client';

import { useSession } from 'next-auth/react';

import DealerChatRoom from '../ChatRoom';
import { useParams } from 'next/navigation';

export default function DealerChatPage() {
    const { data: session } = useSession();
    const params = useParams();
    const quoteId = params?.id as string;

    if (!session) return <div style={{color:'white'}}>로그인이 필요합니다.</div>;

    return (
        <div style={{ height: '100vh', backgroundColor: '#121212' }}>
            <DealerChatRoom
                quoteId={quoteId}
                userId={(session.user as any).id}
                userType="DEALER"
                targetName="고객님"
            />
        </div>
    );
}