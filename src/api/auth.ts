import { apiPost } from './backend';

// Simulate a delay for API calls
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const login = async (username: string, password: string) => {
  try {
    console.log('🔐 Attempting login for:', username, 'password:', password);
    const response = await apiPost('/api/auth/login', { username, password });
    console.log('✅ Login successful, apiPost response:', response);
    console.log('✅ Response keys:', Object.keys(response));
    console.log('✅ User data:', { username: response.username, role: response.role, barangayId: response.barangayId });
    return { data: response };
  } catch (error: any) {
    console.error('❌ Login failed - full error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error response:', error.response);
    throw error;
  }
};

export const logout = async () => {
    await simulateDelay(500); // Simulate network delay
    // In a real application, you'd send a request to invalidate the token on the server
    // try {
    //   await api.post(API_ENDPOINTS.LOGOUT); // Assuming a logout endpoint
    // } catch (error) {
    //   console.error("Error logging out on backend:", error);
    //   throw error;
    // }
    return { message: "Logged out successfully" };
};

export const forgotPassword = async (email: string) => {
    await simulateDelay(1500);
    console.log(`Password reset requested for: ${email}`);
    // Simulate API call
    if (email.includes('@')) {
        return { message: 'If an account with that email exists, a password reset link has been sent.' };
    } else {
        throw { response: { data: { message: 'Invalid email address.' } } };
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    await simulateDelay(1500);
    console.log(`Password reset for token: ${token} with new password.`);
    // Simulate API call
    if (token && newPassword.length >= 6) {
        return { message: 'Your password has been successfully reset.' };
    } else {
        throw { response: { data: { message: 'Invalid token or password does not meet requirements.' } } };
    }
};