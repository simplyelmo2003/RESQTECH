import { AdminNewsVideo } from '@/types/admin';
import { formatISO } from 'date-fns';
import { apiPost, apiGet, apiPut, apiDelete } from './backend';

let SHARED_NEWS_VIDEOS: AdminNewsVideo[] = [];

export const loadSharedNewsVideos = async (): Promise<AdminNewsVideo[]> => {
  try {
    const items = await apiGet('/api/news');
    if (Array.isArray(items)) {
      SHARED_NEWS_VIDEOS = items.map((i: any) => {
        let categoryArray = [];
        try {
          // Category is stored as JSON string on backend
          if (i.category) {
            categoryArray = typeof i.category === 'string' ? JSON.parse(i.category) : (Array.isArray(i.category) ? i.category : []);
          }
        } catch (e) {
          console.warn('Failed to parse category for news item', i.id, ':', e);
          categoryArray = [];
        }
        return {
          id: i.id,
          title: i.title,
          content: i.content || '',
          category: categoryArray,
          mediaType: i.mediaType || 'Article',
          mediaUrl: i.mediaUrl || '',
          thumbnailUrl: i.thumbnailUrl || '',
          publishedAt: i.publishedAt || formatISO(new Date()),
          author: i.author || 'Admin',
          source: i.source || 'Admin',
        };
      });
      console.log('📰 Loaded shared news/videos from backend:', SHARED_NEWS_VIDEOS.length);
    }
  } catch (err) {
    console.error('Error loading shared news/videos from backend:', err);
    SHARED_NEWS_VIDEOS = [];
    // Don't re-throw; gracefully degrade to empty list
  }
  return SHARED_NEWS_VIDEOS;
};

export const getSharedNewsVideos = (): AdminNewsVideo[] => {
  return SHARED_NEWS_VIDEOS;
};

export const addNewsVideo = async (item: Omit<AdminNewsVideo, 'id' | 'publishedAt'>): Promise<AdminNewsVideo> => {
  const created = await apiPost('/api/news', item);
  const newItem: AdminNewsVideo = {
    ...item,
    id: created.id,
    publishedAt: created.publishedAt || formatISO(new Date()),
  };
  SHARED_NEWS_VIDEOS.push(newItem);
  console.log('✅ Added news/video to shared store:', newItem.id);
  return newItem;
};

export const updateNewsVideoInShared = async (id: string, updates: Partial<AdminNewsVideo>): Promise<AdminNewsVideo | null> => {
  const updated = await apiPut(`/api/news/${id}`, updates);
  if (!updated) return null;
  
  const index = SHARED_NEWS_VIDEOS.findIndex(nv => nv.id === id);
  const mappedUpdate: AdminNewsVideo = {
    ...updated,
    id: updated.id,
    publishedAt: updated.publishedAt || formatISO(new Date()),
  };
  if (index !== -1) {
    SHARED_NEWS_VIDEOS[index] = mappedUpdate;
  }
  console.log('✏️ Updated news/video in shared store:', id);
  return mappedUpdate;
};

export const deleteNewsVideoFromShared = async (id: string): Promise<boolean> => {
  await apiDelete(`/api/news/${id}`);
  const index = SHARED_NEWS_VIDEOS.findIndex(nv => nv.id === id);
  if (index !== -1) {
    SHARED_NEWS_VIDEOS.splice(index, 1);
  }
  console.log('🗑️ Deleted news/video from shared store:', id);
  return true;
};
