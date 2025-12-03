import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession({ req, ...authOptions });

        if (!session || !session.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const dealerId = (session.user as any).id;

        const quotes = await prisma.quote.findMany({
            where: {
                chatRoom: {
                    isNot: null
                }
            },
            include: {
                user: true,
                chatRoom: {
                    include: {
                        messages: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: 1
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(quotes);

    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
