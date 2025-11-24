import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm, SignupForm } from '@/components/auth';
import { mockLogin, mockSignup, mockLogout } from '@/__mocks__';
import type { MockAuthUser } from '@/__mocks__';

type AuthDialog = 'login' | 'signup' | null;

export function RootLayout() {
  const [user, setUser] = useState<MockAuthUser | null>(null);
  const [authDialog, setAuthDialog] = useState<AuthDialog>(null);
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const user = await mockLogin(username, password);
      setUser(user);
      setAuthDialog(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (username: string, password: string) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const user = await mockSignup(username, password);
      setUser(user);
      setAuthDialog(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await mockLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openLoginDialog = () => {
    setAuthError('');
    setAuthDialog('login');
  };

  const openSignupDialog = () => {
    setAuthError('');
    setAuthDialog('signup');
  };

  const closeAuthDialog = () => {
    setAuthDialog(null);
    setAuthError('');
  };

  return (
    <>
      <Layout
        user={user}
        onLogin={openLoginDialog}
        onSignup={openSignupDialog}
        onLogout={handleLogout}
      >
        <Outlet />
      </Layout>

      <Dialog open={authDialog === 'login'} onOpenChange={(open) => !open && closeAuthDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to Number Tree</DialogTitle>
          </DialogHeader>
          <LoginForm
            onSubmit={handleLogin}
            error={authError}
            disabled={authLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={authDialog === 'signup'} onOpenChange={(open) => !open && closeAuthDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up for Number Tree</DialogTitle>
          </DialogHeader>
          <SignupForm
            onSubmit={handleSignup}
            error={authError}
            disabled={authLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
