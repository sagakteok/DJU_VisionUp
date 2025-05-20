import { redirect } from 'next/navigation';

export default function auth() {
    redirect('/customer/auth/signin');
}