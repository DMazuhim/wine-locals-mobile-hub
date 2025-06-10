
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Play } from 'lucide-react';

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
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<number | null>(null);

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

  const handleLike = (e: React.MouseEvent, videoId: number) => {
    e.stopPropagation();
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
    console.log('Video liked/unliked!', videoId);
  };

  const handleComment = (e: React.MouseEvent, videoId: number) => {
    e.stopPropagation();
    setShowComments(showComments === videoId ? null : videoId);
    console.log('Show comments for video:', videoId);
  };

  const handleShare = (e: React.MouseEvent, video: VideoData) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?video=${video.videoId}`;
    
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      console.log('Link copiado:', shareUrl);
      // Aqui você pode adicionar um toast para informar que o link foi copiado
    }
  };

  const handlePlayVideo = (videoId: string, index: number) => {
    setPlayingVideo(index);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentVideoIndex && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
      setPlayingVideo(null);
      setShowComments(null);
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
          {/* Video Player or Thumbnail */}
          <div className="absolute inset-0">
            {playingVideo === index ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div 
                className="relative w-full h-full cursor-pointer"
                onClick={() => handlePlayVideo(video.videoId, index)}
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-60 rounded-full p-4">
                    <Play className="w-12 h-12 text-white" fill="white" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col space-y-6 z-10">
            <button 
              onClick={(e) => handleLike(e, video.id)}
              className="flex flex-col items-center space-y-1"
            >
              <div className="bg-gray-800 bg-opacity-80 rounded-full p-3">
                <Heart 
                  className={`w-6 h-6 ${likedVideos.has(video.id) ? 'text-red-500 fill-red-500' : 'text-white'}`}
                />
              </div>
              <span className="text-white text-xs font-medium">12.3K</span>
            </button>

            <button 
              onClick={(e) => handleComment(e, video.id)}
              className="flex flex-col items-center space-y-1"
            >
              <div className={`bg-gray-800 bg-opacity-80 rounded-full p-3 ${showComments === video.id ? 'bg-blue-600' : ''}`}>
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">236</span>
            </button>

            <button 
              onClick={(e) => handleShare(e, video)}
              className="flex flex-col items-center space-y-1"
            >
              <div className="bg-gray-800 bg-opacity-80 rounded-full p-3">
                <Share className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">Share</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments === video.id && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 p-4 z-20 max-h-64 overflow-y-auto">
              <div className="text-white">
                <h4 className="font-semibold mb-3">Comentários</h4>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">U1</span>
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-semibold">@usuario1</span> Ótimo vídeo! 🍷</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">U2</span>
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-semibold">@usuario2</span> Adorei as dicas!</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Adicione um comentário..."
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                  />
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Info - Positioned above footer */}
          <div className="absolute bottom-24 left-4 right-20 z-10">
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
