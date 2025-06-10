
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';

interface VideoData {
  id: number;
  title: string;
  description: string;
  videoId: string;
  thumbUrl: string;
  type: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
}

interface ApiResponse {
  data: VideoData[];
}

const YouTubeShorts: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Fetching videos from API...');
        const response = await fetch('https://api.homolog.guiawinelocals.com/api/videos?publicationState=preview&pagination[pageSize]=100');
        const data: ApiResponse = await response.json();
        console.log('API Response:', data);
        setVideos(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Video liked!');
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Show comments');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Share video');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentVideoIndex && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Carregando vídeos...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Nenhum vídeo encontrado</div>
      </div>
    );
  }

  return (
    <div 
      className="h-full overflow-y-scroll snap-y snap-mandatory bg-black"
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {videos.map((video, index) => (
        <div 
          key={video.id}
          className="relative h-full w-full snap-start flex-shrink-0"
        >
          {/* Video Player */}
          <div className="absolute inset-0">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${video.videoId}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col space-y-6 z-10">
            <button 
              onClick={handleLike}
              className="flex flex-col items-center space-y-1"
            >
              <div className="bg-gray-800 bg-opacity-80 rounded-full p-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">12.3K</span>
            </button>

            <button 
              onClick={handleComment}
              className="flex flex-col items-center space-y-1"
            >
              <div className="bg-gray-800 bg-opacity-80 rounded-full p-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">236</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex flex-col items-center space-y-1"
            >
              <div className="bg-gray-800 bg-opacity-80 rounded-full p-3">
                <Share className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">Share</span>
            </button>
          </div>

          {/* Bottom Info - Positioned above footer */}
          <div className="absolute bottom-28 left-4 right-20 z-10">
            <div className="text-white">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm opacity-90 line-clamp-2 mb-3">
                  {video.description}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">WL</span>
                </div>
                <span className="text-sm font-medium">@winelocals</span>
              </div>
            </div>
          </div>

          {/* Video Progress Indicator */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex space-x-1">
              {videos.map((_, i) => (
                <div 
                  key={i}
                  className={`h-0.5 flex-1 rounded-full ${
                    i === index ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YouTubeShorts;
