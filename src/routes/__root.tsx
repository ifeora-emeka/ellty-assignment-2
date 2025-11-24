import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm, SignupForm } from '@/components/auth';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';

type AuthDialog = 'login' | 'signup' | null;

export function RootLayout() {
  const authContext = useAuth();
  const [authDialog, setAuthDialog] = useState<AuthDialog>(null);

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      await authContext.login(data.username, data.password);
      setAuthDialog(null);
      toast.success('Successfully logged in!');
    } catch (error) {
      if (error instanceof ApiError && error.data) {
        const errorData = error.data as { error?: string; errors?: Array<{ message: string }> };
        if (errorData.errors && errorData.errors.length > 0) {
          toast.error(errorData.errors[0].message);
        } else if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error('Login failed');
        }
      } else {
        toast.error(error instanceof Error ? error.message : 'Login failed');
      }
      throw error;
    }
  };

  const handleSignup = async (data: { username: string; password: string }) => {
    try {
      await authContext.signup(data.username, data.password);
      setAuthDialog(null);
      toast.success('Account created successfully!');
    } catch (error) {
      if (error instanceof ApiError && error.data) {
        const errorData = error.data as { error?: string; errors?: Array<{ message: string }> };
        if (errorData.errors && errorData.errors.length > 0) {
          toast.error(errorData.errors[0].message);
        } else if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error('Signup failed');
        }
      } else {
        toast.error(error instanceof Error ? error.message : 'Signup failed');
      }
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authContext.logout();
      toast.success('Logged out successfully');
    } catch {
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
        user={authContext.user}
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
