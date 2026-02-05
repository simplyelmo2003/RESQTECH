import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GuestLayout from '@/layouts/GuestLayout';
import { forgotPassword as apiForgotPassword } from '@/api/auth';
import { useNotification } from '@/hooks/useNotifications';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { addNotification } = useNotification();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError('Email address is required.');
      setLoading(false);
      addNotification({ type: 'error', message: 'Email address is required.' });
      return;
    }

    try {
      const response = await apiForgotPassword(email);
      setMessage(response.message);
      addNotification({ type: 'success', message: response.message });
      // Optionally navigate to a page telling user to check email
      // navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
      addNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 space-y-6" title="Forgot Your Password?">
          {message ? (
            <div className="text-center">
              <p className="text-lg text-accent font-medium mb-4">{message}</p>
              <Link to="/login">
                <Button variant="primary">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <p className="text-sm text-gray-600 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error || undefined}
              />

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                  disabled={loading}
                >
                  Send Reset Link
                </Button>
              </div>
              <div className="text-sm text-center">
                <Link to="/login" className="font-medium text-secondary hover:text-brand-teal">
                  Remembered your password? Login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </GuestLayout>
  );
};

export default ForgotPasswordPage;