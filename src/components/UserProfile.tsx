
import React, { useState } from 'react';
import { User, MapPin, Calendar, LogOut, Package, Percent, Lock, FileText, Phone, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Login from './Login';
import OrdersList from './OrdersList';
import VouchersList from './VouchersList';
import ChangePassword from './ChangePassword';

type ViewType = 'profile' | 'orders' | 'vouchers' | 'security';

const UserProfile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [jwt, setJwt] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('profile');

  const handleLoginSuccess = (userData: any, token: string) => {
    setUser(userData);
    setJwt(token);
    setIsLoggedIn(true);
    console.log('Login successful:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    setJwt('');
    setIsLoggedIn(false);
    setCurrentView('profile');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'orders') {
    return <OrdersList jwt={jwt} onBack={() => setCurrentView('profile')} />;
  }

  if (currentView === 'vouchers') {
    return <VouchersList jwt={jwt} onBack={() => setCurrentView('profile')} />;
  }

  if (currentView === 'security') {
    return <ChangePassword jwt={jwt} onBack={() => setCurrentView('profile')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header do perfil */}
      <div className="bg-gray-800 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Meu perfil</h1>
          <Button
            variant="ghost"
            className="text-blue-400 hover:bg-gray-700"
            onClick={() => console.log('Editar perfil')}
          >
            Editar dados
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.avatar || ''} alt={user?.username || 'User'} />
            <AvatarFallback className="bg-gray-600 text-white text-xl">
              {user?.username ? getInitials(user.username) : 'DI'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.username || 'Diego'}</h2>
            <div className="flex items-center mt-2 text-gray-300">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">55 (51) 99130-4597</span>
            </div>
            <div className="flex items-center mt-1 text-gray-300">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">{user?.email || 'mazuhimdiego@gmail.com'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cards de opções */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => console.log('Informações pessoais')}>
            <CardContent className="flex items-center p-4">
              <FileText className="w-6 h-6 text-gray-600 mr-4" />
              <div>
                <h3 className="font-semibold">Informações pessoais</h3>
                <p className="text-sm text-gray-600">Visualize ou edite seus dados cadastrados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('security')}>
            <CardContent className="flex items-center p-4">
              <Lock className="w-6 h-6 text-gray-600 mr-4" />
              <div>
                <h3 className="font-semibold">Segurança</h3>
                <p className="text-sm text-gray-600">Atualize a senha da sua conta</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('orders')}>
            <CardContent className="flex items-center p-4">
              <Package className="w-6 h-6 text-gray-600 mr-4" />
              <div>
                <h3 className="font-semibold">Meus pedidos</h3>
                <p className="text-sm text-gray-600">Encontre todos os seus pedidos realizados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('vouchers')}>
            <CardContent className="flex items-center p-4">
              <Percent className="w-6 h-6 text-gray-600 mr-4" />
              <div>
                <h3 className="font-semibold">Meus cupons</h3>
                <p className="text-sm text-gray-600">Visualize todos os seus cupons disponíveis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botão de logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 mt-6"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
