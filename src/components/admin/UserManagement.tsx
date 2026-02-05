import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import {
  getSystemUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/api/admin';
import { SystemUser } from '@/types/admin';
import { SURIGAO_CITY_BARANGAYS } from '@/lib/barangayData';

import { useForm, SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns';

type UserFormInputs = Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt' | 'token'> & {
  password?: string; // Optional for edit, required for create
};

const userRoleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'barangay', label: 'Barangay Official' },
  { value: 'guest', label: 'Guest User' },
];

// Barangay options derived from canonical Surigao City barangay data
const barangayOptions = SURIGAO_CITY_BARANGAYS.map(b => ({ value: b.id, label: b.displayName }));

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
    const { addNotification } = useNotification();

    const { register, handleSubmit, reset, watch, formState: { errors, isValid, isDirty, isSubmitting } } = useForm<UserFormInputs>();
    const watchedRole = watch('role');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            console.log('🔄 fetchUsers - calling getSystemUsers()');
            const data = await getSystemUsers();
            console.log('🔄 fetchUsers - received:', data);
            setUsers(data || []);
        } catch (err) {
            console.error("Failed to fetch system users:", err);
            setError("Failed to load system users. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [addNotification]); // addNotification might not be stable, careful with direct deps if causing re-renders

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenCreateForm = () => {
        setEditingUser(null);
        reset({ // Reset with empty values for creation
            username: '',
            email: '',
            role: 'guest', // Default role
            password: '',
            isActive: true,
            barangayId: '',
        });
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (user: SystemUser) => {
        setEditingUser(user);
        reset({ // Populate form with existing data
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            barangayId: user.barangayId,
            password: '', // Never pre-fill passwords
        });
        setIsFormModalOpen(true);
    };

    const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
        try {
            // Validate barangay selection for barangay users
            if (data.role === 'barangay' && !data.barangayId) {
                addNotification({ type: 'error', message: 'Please select a barangay for Barangay Officials.' });
                return;
            }

            if (editingUser) {
                // For existing user, only update changed fields, exclude password if empty
                const updatePayload: Partial<Omit<SystemUser, 'token'>> = {
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    barangayId: data.role === 'barangay' ? data.barangayId : undefined,
                };
                if (data.password) {
                    addNotification({ type: 'warning', message: 'Password change simulated for existing user.' });
                }
                await updateUser(editingUser.id, updatePayload);
                addNotification({ type: 'success', message: 'User updated successfully!' });
            } else {
                // For new user, password is required
                if (!data.password) {
                  addNotification({ type: 'error', message: 'Password is required for new users.' });
                  return;
                }
                const createPayload = {
                    username: data.username,
                    email: data.email || data.username, // Use username as email if email not provided
                    role: data.role,
                    barangayId: data.role === 'barangay' ? data.barangayId : undefined,
                    password: data.password,
                } as Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt' | 'token'> & { password: string };
                
                console.log('📝 Creating user with payload:', createPayload);
                await createUser(createPayload);
                addNotification({ type: 'success', message: `User "${data.username}" created successfully! They can now login with password: ${data.password}` });
            }
            setIsFormModalOpen(false);
            fetchUsers(); // Re-fetch data
        } catch (err: any) {
            console.error("Failed to save user:", err);
            const errorMsg = err?.message || err?.toString() || 'Failed to save user.';
            addNotification({ type: 'error', message: `Error: ${errorMsg}` });
        }
    };

    const handleDeleteClick = (user: SystemUser) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            addNotification({ type: 'success', message: 'User deleted successfully!' });
            setIsDeleteModalOpen(false);
            fetchUsers(); // Re-fetch data
        } catch (err: any) {
            console.error("Failed to delete user:", err);
            addNotification({ type: 'error', message: err.message || 'Failed to delete user.' });
        }
    };

    if (loading) {
        return (
            <Card title="User Management" className="min-h-[500px] flex justify-center items-center">
                <LoadingSpinner size="lg" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="User Management" className="min-h-[500px] flex justify-center items-center text-danger">
                <p>{error}</p>
            </Card>
        );
    }

    return (
        <Card title="User Management">
            <div className="flex justify-end mb-4">
                <Button onClick={handleOpenCreateForm} variant="primary">
                    Add New User
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-primary/5 border-b border-primary/10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                                Barangay
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-primary/2 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'admin' ? 'bg-secondary/10 text-secondary' :
                                            user.role === 'barangay' ? 'bg-primary/10 text-primary' :
                                            'bg-dark/5 text-dark'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">
                                        {user.barangayId ? SURIGAO_CITY_BARANGAYS.find(b => b.id === user.barangayId)?.displayName || user.barangayId : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.isActive ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">
                                        {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(user)} className="mr-2">
                                            Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(user)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-dark/50">
                                    No system users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormModalOpen && (
                <ConfirmationModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onConfirm={handleSubmit(onSubmit)}
                    title={editingUser ? 'Edit User' : 'Add New User'}
                    confirmText={editingUser ? 'Save Changes' : 'Create User'}
                    cancelText="Cancel"
                    isConfirming={isSubmitting}
                    disableConfirm={!isValid || !isDirty}
                    message={
                        <form id="user-form" className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                id="username"
                                label="Username"
                                {...register('username', { required: 'Username is required' })}
                                error={errors.username?.message}
                            />
                            <Input
                                id="email"
                                label="Email (optional - will use username if blank)"
                                type="email"
                                {...register('email', { pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }})}
                                error={errors.email?.message}
                            />
                            <Select
                                id="role"
                                label="Role"
                                options={userRoleOptions}
                                {...register('role', { required: 'Role is required' })}
                                error={errors.role?.message}
                            />
                            {watchedRole === 'barangay' && (
                                <Select
                                    id="barangayId"
                                    label="Assign to Barangay"
                                    options={barangayOptions}
                                    placeholder="Select Barangay"
                                    {...register('barangayId', { required: 'Barangay is required for Barangay Officials' })}
                                    error={errors.barangayId?.message}
                                />
                            )}
                            <Input
                                id="password"
                                label={editingUser ? 'New Password (Leave empty to keep current)' : 'Password'}
                                type="password"
                                {...register('password', { required: editingUser ? false : 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' }})}
                                error={errors.password?.message}
                            />
                            <div className="flex items-center">
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    {...register('isActive')}
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                    Is Active
                                </label>
                            </div>
                        </form>
                    }
                />
            )}

            {userToDelete && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => confirmDelete()}
                    title="Confirm Delete User"
                    message={`Are you sure you want to delete user "${userToDelete.username} (${userToDelete.role})"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                />
            )}
        </Card>
    );
};

export default AdminUserManagement;