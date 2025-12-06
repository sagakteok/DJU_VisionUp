'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ChatRoom from './ChatRoom'

type SenderType = 'USER' | 'DEALER'

export default function ChatPage() {
    const searchParams = useSearchParams()
    const quoteId = searchParams?.get('quoteId') ?? ''
    const userId = searchParams?.get('userId') ?? ''
    const typeParam = searchParams?.get('type')
    const userType: SenderType = typeParam === 'DEALER' ? 'DEALER' : 'USER'
    const targetName = searchParams?.get('targetName') ?? (userType === 'USER' ? '담당 딜러' : '고객님')

    if (!quoteId || !userId) {
        return <div>잘못된 접근입니다.</div>
    }

    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <ChatRoom
                quoteId={quoteId}
                userId={userId}
                userType={userType}
                targetName={targetName}
            />
        </Suspense>
    )
}