import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GuestLayout from '@/layouts/GuestLayout';
import { resetPassword as apiResetPassword } from '@/api/auth';
import { useNotification } from '@/hooks/useNotifications';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!token) {
      addNotification({ type: 'error', message: 'Password reset token is missing or invalid.' });
      navigate('/forgot-password', { replace: true });
    }
  }, [token, navigate, addNotification]);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm() || !token) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiResetPassword(token, password);
      setMessage(response.message + " You can now login with your new password.");
      addNotification({ type: 'success', message: response.message });
      // Optionally redirect to login after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. The link might be expired or invalid.';
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      addNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
        <GuestLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] py-12">
                <Card className="max-w-md w-full p-8 text-center" title="Invalid Link">
                    <p className="text-danger text-lg mb-4">Password reset link is invalid or missing.</p>
                    <Link to="/forgot-password"><Button>Go to Forgot Password</Button></Link>
                </Card>
            </div>
        </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 space-y-6" title="Reset Your Password">
          {message ? (
            <div className="text-center">
              <p className="text-lg text-accent font-medium mb-4">{message}</p>
              <Link to="/login">
                <Button variant="primary">Proceed to Login</Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <p className="text-sm text-gray-600 text-center">
                Please enter your new password. Make sure it's strong and something you haven't used before.
              </p>
              <Input
                id="password"
                name="password"
                type="password"
                label="New Password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              {errors.general && (
                <p className="text-sm text-danger text-center">{errors.general}</p>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                  disabled={loading}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </GuestLayout>
  );
};

export default ResetPasswordPage;