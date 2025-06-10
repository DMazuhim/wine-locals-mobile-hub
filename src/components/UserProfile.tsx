
import React, { useState } from 'react';
import { User, Wine, MapPin, Calendar, Heart, Star, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UserProfile: React.FC = () => {
  const [user] = useState({
    name: 'Maria Silva',
    email: 'maria@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-03-15',
    location: 'São Paulo, SP',
    favoriteWines: 15,
    reviews: 8,
    badges: ['Degustador Iniciante', 'Amante de Tintos', 'Explorer Local'],
    recentActivity: [
      { type: 'review', wine: 'Cabernet Sauvignon 2020', rating: 4.5, date: '2024-01-15' },
      { type: 'visit', winery: 'Vinícola Vale dos Vinhedos', date: '2024-01-10' },
      { type: 'favorite', wine: 'Malbec Reserva 2019', date: '2024-01-08' }
    ]
  });

  const handleEditProfile = () => {
    console.log('Editar perfil');
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pb-20">
      {/* Header com gradiente */}
      <div className="profile-gradient p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 border-4 border-white/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-white/20 text-white text-xl">MS</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-red-100 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {user.location}
            </p>
            <p className="text-red-100 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              Membro desde {new Date(user.joinDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Estatísticas */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-burgundy-700">{user.favoriteWines}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-1" />
                  Favoritos
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy-700">{user.reviews}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Star className="w-4 h-4 mr-1" />
                  Avaliações
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy-700">{user.badges.length}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Wine className="w-4 h-4 mr-1" />
                  Conquistas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges/Conquistas */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy-800">Suas Conquistas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-burgundy-100 text-burgundy-800">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy-800">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {user.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-500" />}
                {activity.type === 'visit' && <MapPin className="w-5 h-5 text-green-500" />}
                {activity.type === 'favorite' && <Heart className="w-5 h-5 text-red-500" />}
                
                <div className="flex-1">
                  {activity.type === 'review' && (
                    <p className="text-sm">
                      Avaliou <span className="font-semibold">{activity.wine}</span> com {activity.rating} estrelas
                    </p>
                  )}
                  {activity.type === 'visit' && (
                    <p className="text-sm">
                      Visitou <span className="font-semibold">{activity.winery}</span>
                    </p>
                  )}
                  {activity.type === 'favorite' && (
                    <p className="text-sm">
                      Adicionou <span className="font-semibold">{activity.wine}</span> aos favoritos
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-3">
          <Button 
            onClick={handleEditProfile}
            className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800"
          >
            <User className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
