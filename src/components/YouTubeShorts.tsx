
import React, { useState, useEffect } from 'react';
import { Play, Heart, MessageCircle, Share } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
}

const YouTubeShorts: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);

  useEffect(() => {
    // Mock data para simular videos do canal Wine Locals
    const mockVideos: VideoData[] = [
      {
        id: '1',
        title: 'Como harmonizar vinho tinto com carnes',
        thumbnail: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=600&fit=crop',
        views: '15.2K',
        likes: '892'
      },
      {
        id: '2',
        title: 'Dica rápida: temperatura ideal para servir vinhos',
        thumbnail: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop',
        views: '8.7K',
        likes: '543'
      },
      {
        id: '3',
        title: 'Tour pela vinícola local - Parte 1',
        thumbnail: 'https://images.unsplash.com/photo-1574796944073-34d6f8a56d92?w=400&h=600&fit=crop',
        views: '22.1K',
        likes: '1.2K'
      },
      {
        id: '4',
        title: 'Degustação às cegas - você acertaria?',
        thumbnail: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=600&fit=crop',
        views: '12.8K',
        likes: '756'
      }
    ];
    setVideos(mockVideos);
  }, []);

  const handleVideoClick = (videoId: string) => {
    // Abre o YouTube com o canal Wine Locals
    window.open('https://www.youtube.com/@winelocals', '_blank');
  };

  return (
    <div className="youtube-container overflow-y-auto">
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Wine Locals Shorts</h1>
        <p className="text-center text-red-100 text-sm mt-1">Descubra o mundo dos vinhos</p>
      </div>
      
      <div className="p-4 space-y-6">
        {videos.map((video) => (
          <div 
            key={video.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
            onClick={() => handleVideoClick(video.id)}
          >
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-4 shadow-lg">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                {video.views} views
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">
                {video.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{video.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Comentar</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                    <Share className="w-5 h-5" />
                    <span className="text-sm">Compartilhar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center py-8">
          <button 
            onClick={() => window.open('https://www.youtube.com/@winelocals', '_blank')}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Ver mais no YouTube
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeShorts;
