'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ChatRoom from './ChatRoom';

function ChatPageContent() {
    const searchParams = useSearchParams();

    const quoteId = searchParams?.get('quoteId') || 'default-quote-id';
    const userId = searchParams?.get('userId') || 'default-user-id';
    const typeParam = searchParams?.get('type');

    const userType: 'USER' | 'DEALER' = (typeParam === 'DEALER') ? 'DEALER' : 'USER';

    // 딜러가 들어오면 URL의 targetName(고객명)을 쓰고, 고객이 들어오면 '담당 딜러'로 표시
    const targetName = searchParams?.get('targetName') || (userType === 'USER' ? '담당 딜러' : '고객님');

    return (
        <ChatRoom
            quoteId={quoteId}
            userId={userId}
            userType={userType}
            targetName={targetName}
        />
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>채팅방 연결 중...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}