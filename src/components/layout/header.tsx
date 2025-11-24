import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
    user?: {
        id: string;
        username: string;
    } | null;
    onLogin?: () => void;
    onSignup?: () => void;
    onLogout?: () => void;
}

export function Header({ user, onLogin, onSignup, onLogout }: HeaderProps) {
    const getUserInitials = (username: string) => {
        return username.slice(0, 2).toUpperCase();
    };

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Number Tree</h1>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{user.username}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" onClick={onLogin}>
                                Login
                            </Button>
                            <Button size="sm" onClick={onSignup}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
