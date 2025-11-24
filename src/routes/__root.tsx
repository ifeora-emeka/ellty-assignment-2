import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm, SignupForm } from '@/components/auth';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

type AuthDialog = 'login' | 'signup' | null;

export function RootLayout() {
  const { state, login, signup, logout } = useAuth();
  const [authDialog, setAuthDialog] = useState<AuthDialog>(null);

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      await login(data.username, data.password);
      setAuthDialog(null);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const handleSignup = async (data: { username: string; password: string }) => {
    try {
      await signup(data.username, data.password);
      setAuthDialog(null);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const openLoginDialog = () => {
    setAuthDialog('login');
  };

  const openSignupDialog = () => {
    setAuthDialog('signup');
  };

  const closeAuthDialog = () => {
    setAuthDialog(null);
  };

  return (
    <>
      <Layout
        user={state.user}
        onLogin={openLoginDialog}
        onSignup={openSignupDialog}
        onLogout={handleLogout}
      >
        <Outlet context={{ openLoginDialog, openSignupDialog }} />
      </Layout>

      <Dialog open={authDialog === 'login'} onOpenChange={(open) => !open && closeAuthDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to Number Tree</DialogTitle>
          </DialogHeader>
          <LoginForm onSubmit={handleLogin} />
        </DialogContent>
      </Dialog>

      <Dialog open={authDialog === 'signup'} onOpenChange={(open) => !open && closeAuthDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up for Number Tree</DialogTitle>
          </DialogHeader>
          <SignupForm onSubmit={handleSignup} />
        </DialogContent>
      </Dialog>
    </>
  );
}
