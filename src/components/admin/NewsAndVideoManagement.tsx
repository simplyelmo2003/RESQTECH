import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import {
  getAdminNewsAndVideos,
  createNewsAndVideo,
  updateNewsAndVideo,
  deleteNewsAndVideo,
} from '@/api/admin';
import { AdminNewsVideo } from '@/types/admin';
import { NewsAndVideo as GuestNewsAndVideoType, NewsCategory, MediaType } from '@/types/guest';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { format } from 'date-fns';

type NewsAndVideoFormInputs = Omit<GuestNewsAndVideoType, 'id' | 'publishedAt'>;

const newsCategoryOptions = Object.values(NewsCategory).map(cat => ({ value: cat, label: cat }));
const mediaTypeOptions = Object.values(MediaType).map(type => ({ value: type, label: type }));


const AdminNewsAndVideoManagement: React.FC = () => {
    const [newsItems, setNewsItems] = useState<AdminNewsVideo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [editingNewsItem, setEditingNewsItem] = useState<AdminNewsVideo | null>(null);
    const [newsItemToDelete, setNewsItemToDelete] = useState<AdminNewsVideo | null>(null);
    const { addNotification } = useNotification();

    const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<NewsAndVideoFormInputs>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            content: '',
            category: [],
            mediaType: 'Article',
            mediaUrl: '',
            thumbnailUrl: '',
            author: '',
            source: '',
        },
    });
    const watchedMediaType = watch('mediaType');

    const fetchNewsItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAdminNewsAndVideos();
            // Defensive: ensure array, and each item has required fields
            const safeData = Array.isArray(data) ? data.map(item => ({
                ...item,
                category: Array.isArray(item.category) ? item.category : [],
                publishedAt: item.publishedAt || new Date().toISOString(),
            })) : [];
            setNewsItems(safeData);
        } catch (err) {
            console.error("Failed to fetch news and videos:", err);
            setError("Failed to load news and videos. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNewsItems();
    }, [fetchNewsItems]);

    const handleOpenCreateForm = () => {
        setEditingNewsItem(null);
        reset({ // Reset with empty values for creation
            title: '',
            content: '',
            category: [],
            mediaType: 'Article', // Default type
            mediaUrl: '',
            thumbnailUrl: '',
            author: '',
            source: '',
        });
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (item: AdminNewsVideo) => {
        setEditingNewsItem(item);
        // Ensure category is an array when resetting for multi-select
        reset({ ...item, category: item.category || [] });
        setIsFormModalOpen(true);
    };

    const onSubmit: SubmitHandler<NewsAndVideoFormInputs> = async (data) => {
        try {
            // Ensure category is an array of strings
            const formattedData = {
                ...data,
                category: Array.isArray(data.category) ? data.category : [data.category],
            };

            if (editingNewsItem) {
                await updateNewsAndVideo(editingNewsItem.id, formattedData);
                addNotification({ type: 'success', message: 'News/Video item updated successfully!' });
            } else {
                await createNewsAndVideo(formattedData);
                addNotification({ type: 'success', message: 'News/Video item created successfully!' });
            }
            setIsFormModalOpen(false);
            fetchNewsItems(); // Re-fetch data
        } catch (err: any) {
            console.error("Failed to save news/video item:", err);
            addNotification({ type: 'error', message: err.message || 'Failed to save news/video item.' });
        }
    };

    const handleDeleteClick = (item: AdminNewsVideo) => {
        setNewsItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!newsItemToDelete) return;
        try {
            await deleteNewsAndVideo(newsItemToDelete.id);
            addNotification({ type: 'success', message: 'News/Video item deleted successfully!' });
            setIsDeleteModalOpen(false);
            fetchNewsItems(); // Re-fetch data
        } catch (err: any) {
            console.error("Failed to delete news/video item:", err);
            addNotification({ type: 'error', message: err.message || 'Failed to delete news/video item.' });
        }
    };

    if (loading) {
        return (
            <Card title="News & Video Management" className="min-h-[500px] flex justify-center items-center">
                <LoadingSpinner size="lg" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="News & Video Management" className="min-h-[500px] flex justify-center items-center text-danger">
                <p>{error}</p>
            </Card>
        );
    }

    try {
        return (
            <Card title="News & Video Management">
                <div className="flex justify-end mb-4">
                    <Button onClick={handleOpenCreateForm} variant="primary">
                        Add New News/Video
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-2xl shadow-2xl border-2 border-brand-navy/10 bg-gradient-to-br from-white to-brand-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                    Author / Source
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                    Published At
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {newsItems.length > 0 ? (
                                newsItems.map((item, idx) => (
                                    <tr key={item.id || Math.random()} className={`${idx % 2 === 0 ? 'bg-brand-navy/2' : 'bg-brand-teal/3'} hover:bg-gradient-to-r hover:from-brand-teal/15 hover:to-brand-navy/10 border-l-4 border-l-transparent hover:border-l-brand-teal transition-all duration-200`}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-sm truncate">{item.title || 'Untitled'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.mediaType === 'Article' ? 'bg-brand-navy/20 text-brand-navy border border-brand-navy/40' :
                                                (item.mediaType && (item.mediaType.includes('Video') || item.mediaType.includes('Live'))) ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {item.mediaType || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {(Array.isArray(item.category) ? item.category : []).map((cat, idx) => (
                                                <span key={idx} className="inline-block bg-brand-navy-light/10 text-brand-navy text-xs px-2 py-0.5 rounded-full mr-1 mb-1">
                                                    {cat}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.author || 'N/A'} ({item.source || 'N/A'})</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.publishedAt ? format(new Date(item.publishedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(item)} className="mr-2">
                                                Edit
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteClick(item)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No news or video items found.
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
                        onConfirm={() => {
                            const form = document.getElementById('news-video-form') as HTMLFormElement;
                            if (form) {
                                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                            }
                        }}
                        title={editingNewsItem ? 'Edit News/Video Item' : 'Add New News/Video Item'}
                        confirmText={editingNewsItem ? 'Save Changes' : 'Create Item'}
                        cancelText="Cancel"
                        isConfirming={isSubmitting}
                        disableConfirm={false}
                        message={
                            <form id="news-video-form" className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
                                {/* ...existing code for form fields... */}
                                <Input
                                    id="title"
                                    label="Title"
                                    {...register('title', { required: 'Title is required' })}
                                    error={errors.title?.message}
                                />
                                <Textarea
                                    id="content"
                                    label="Content / Description"
                                    rows={5}
                                    {...register('content', { required: 'Content is required' })}
                                    error={errors.content?.message}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-1">Categories (Select all that apply)</label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ 
                                            validate: value => (value && Array.isArray(value) && value.length > 0) || 'At least one category is required' 
                                        }}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-2 gap-2">
                                                {newsCategoryOptions.map(option => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`category-${option.value}`}
                                                            checked={field.value?.includes(option.value) || false}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                const currentCategories = field.value || [];
                                                                let newCategories;
                                                                if (isChecked) {
                                                                    newCategories = [...currentCategories, option.value];
                                                                } else {
                                                                    newCategories = currentCategories.filter(cat => cat !== option.value);
                                                                }
                                                                field.onChange(newCategories);
                                                            }}
                                                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                        />
                                                        <label htmlFor={`category-${option.value}`} className="ml-2 block text-sm text-gray-700">
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    {errors.category && <p className="mt-1 text-sm text-danger">{errors.category.message}</p>}
                                </div>
                                <Select
                                    id="mediaType"
                                    label="Media Type"
                                    options={mediaTypeOptions}
                                    {...register('mediaType', { required: 'Media type is required' })}
                                    error={errors.mediaType?.message}
                                />
                                <Input
                                    id="mediaUrl"
                                    label={watchedMediaType === 'Article' ? 'Main Image URL (Optional)' : 'Media URL (YouTube/FB/Video)'}
                                    {...register('mediaUrl', { required: 'Media URL is required' })}
                                    error={errors.mediaUrl?.message}
                                />
                                <Input
                                    id="thumbnailUrl"
                                    label="Thumbnail URL (Optional)"
                                    {...register('thumbnailUrl')}
                                    error={errors.thumbnailUrl?.message}
                                />
                                <Input
                                    id="author"
                                    label="Author"
                                    {...register('author', { required: 'Author is required' })}
                                    error={errors.author?.message}
                                />
                                <Input
                                    id="source"
                                    label="Source"
                                    {...register('source', { required: 'Source is required' })}
                                    error={errors.source?.message}
                                />
                            </form>
                        }
                    />
                )}

                {newsItemToDelete && (
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={() => confirmDelete()}
                        title="Confirm Delete News/Video Item"
                        message={`Are you sure you want to delete "${newsItemToDelete.title}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="danger"
                    />
                )}
            </Card>
        );
    } catch (err) {
        console.error('Render error in NewsAndVideoManagement:', err);
        return (
            <Card title="News & Video Management" className="min-h-[500px] flex justify-center items-center text-danger">
                <p>Something went wrong while rendering News & Video Management.</p>
            </Card>
        );
    }
};

export default AdminNewsAndVideoManagement;