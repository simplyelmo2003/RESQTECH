import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GuestLayout from '@/layouts/GuestLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotifications';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const { login, loading } = useAuth();
  const { addNotification } = useNotification();


  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username) newErrors.username = 'Username or Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) {
      addNotification({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      await login(username, password);
      // Redirection logic is handled by App.tsx useEffect based on user role
      // addNotification({ type: 'success', message: 'Login successful!' }); // This is now handled by AuthContext
    } catch (err: any) {
      // Error message is already added by AuthContext in login function
      // Optionally, set a general error here if you want to display it specifically on the form
      setErrors((prev) => ({ ...prev, general: err.response?.data?.message || 'Login failed. Please try again.' }));
    }
  };

  return (
    <GuestLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 space-y-6" title="Login to Your Account">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="username"
              name="username"
              type="text"
              label="Username or Email"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            {errors.general && (
              <p className="text-sm text-danger text-center">{errors.general}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="text-sm text-center">
            <Link to="/guest/home" className="font-medium text-secondary hover:text-brand-teal">
              Continue as Guest
            </Link>
          </div>
        </Card>
      </div>
    </GuestLayout>
  );
};

export default LoginPage;