import type { ReactNode } from 'react';
import { Header } from './header';

interface LayoutProps {
    children: ReactNode;
    user?: {
        id: string;
        username: string;
    } | null;
    onLogin?: () => void;
    onSignup?: () => void;
    onLogout?: () => void;
}

export function Layout({ children, user, onLogin, onSignup, onLogout }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header user={user} onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    Number Tree - A collaborative calculation platform
                </div>
            </footer>
        </div>
    );
}
