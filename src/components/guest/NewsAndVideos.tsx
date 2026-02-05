import React, { useState, useEffect } from 'react';
import { getNewsAndVideos } from '@/api/guest';
import { NewsAndVideo, NewsCategory } from '@/types/guest';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card'; // Assuming Card component for individual items
import { parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom';

interface NewsAndVideosProps {
  previewMode?: boolean; // If true, shows fewer items and a "view all" link
}

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string => {
  // If already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
    videoId = match ? match[1] : '';
  }
  // Format: https://youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    videoId = match ? match[1] : '';
  }
  // Format: VIDEO_ID only
  else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
    videoId = url;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const NewsAndVideos: React.FC<NewsAndVideosProps> = ({ previewMode = false }) => {
  const [items, setItems] = useState<NewsAndVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<'' | NewsCategory>('');
  const [filterLatest, setFilterLatest] = useState<boolean>(true);

  const itemsPerPage = previewMode ? 3 : 6; // Show 3 in preview, 6 for full page

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, total, page, limit } = await getNewsAndVideos(
          currentPage,
          itemsPerPage,
          filterCategory === '' ? undefined : filterCategory,
          filterLatest
        );
        setItems(data);
        setTotalPages(Math.ceil(total / limit));
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch news and videos:", err);
        setError("Failed to load news and videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [currentPage, itemsPerPage, filterCategory, filterLatest]);


  const allCategories: NewsCategory[] = ['Advisory', 'Safety Tips', 'Preparedness', 'Updates', 'Event'];
  const categoryOptions = [{ value: '', label: 'All Categories' }, ...allCategories.map(cat => ({ value: cat, label: cat }))];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderMedia = (item: NewsAndVideo) => {
    switch (item.mediaType) {
      case 'YouTube':
        return (
          <iframe
            className="w-full aspect-video rounded-md mb-3"
            src={getYouTubeEmbedUrl(item.mediaUrl)}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      case 'Facebook Live':
        return (
          <div className="relative w-full aspect-video rounded-md mb-3 overflow-hidden">
            {/* Facebook embed code needs specific setup, using a placeholder for now */}
            <img src={item.thumbnailUrl || 'https://via.placeholder.com/400x225?text=Facebook+Live'} alt="Facebook Live" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold">
              Facebook Live Video (Click to view)
            </div>
          </div>
        );
      case 'Uploaded Video':
        return (
          <video controls className="w-full aspect-video rounded-md mb-3">
            <source src={item.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'Article':
      default:
        return item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-40 object-cover rounded-md mb-3" />
        ) : null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner size="md" />
        <span className="ml-2 text-dark">Loading news and updates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!previewMode && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select
            id="category-filter"
            options={categoryOptions}
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value as NewsCategory | '');
              setCurrentPage(1); // Reset to first page on filter change
            }}
            placeholder="Filter by Category"
            className="flex-1 mb-0"
          />
          <Select
            id="sort-filter"
            options={[{ value: 'true', label: 'Latest' }, { value: 'false', label: 'Oldest First' }]}
            value={filterLatest.toString()}
            onChange={(e) => {
              setFilterLatest(e.target.value === 'true');
              setCurrentPage(1); // Reset to first page on sort change
            }}
            className="flex-1 mb-0"
          />
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="relative overflow-hidden">
              {renderMedia(item)}
              <div className="p-4 pt-0"> {/* Adjusted padding after media */}
                <h3 className="font-bold text-lg text-dark mb-2 leading-tight">
                  {item.mediaType === 'Article' ? item.title :
                  <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{item.title}</a>}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.category.map(cat => (
                      <span key={cat} className="px-2 py-0.5 bg-brand-teal text-white text-xs rounded-full">
                        {cat}
                      </span>
                    ))}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.content}</p>
                <div className="text-xs text-gray-500">
                  <span>{format(parseISO(item.publishedAt), 'MMM dd, yyyy')}</span> |
                  <span className="font-medium ml-1">{item.author} ({item.source})</span>
                </div>
                {item.mediaType === 'Article' && (
                  <div className="mt-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => console.log('View article details', item.id)}>
                      Read More
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No news or videos found matching your criteria.</p>
      )}

      {!previewMode && items.length > 0 && (
        <div className="flex justify-between items-center mt-8">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline">
            Previous
          </Button>
          <span className="text-sm text-dark">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
            Next
          </Button>
        </div>
      )}

      {previewMode && (
        <div className="text-center mt-8">
          <Link to="/guest/news">
            <Button variant="secondary">View All News & Videos</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsAndVideos;