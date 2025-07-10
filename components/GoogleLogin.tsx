import { redirect } from 'next/navigation';
import { Button } from './ui/button';
import GoogleIcon from './Icons/GoogleIcon';

export default function GoogleLoginButton() {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;
    return (
        <Button onClick={() => redirect(`${SERVER_URL}/api/v1/auth/google`)} variant="outline" className="h-10 w-full">
            <GoogleIcon />
            Login with Google
        </Button>
    );
}
