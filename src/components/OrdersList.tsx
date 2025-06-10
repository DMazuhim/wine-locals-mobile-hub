
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package } from 'lucide-react';

interface OrdersListProps {
  jwt: string;
  onBack: () => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ jwt, onBack }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingCanceled, setLoadingCanceled] = useState(true);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const response = await fetch('https://api.guiawinelocals.com/api/users/orders?type=active', {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        setActiveOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos ativos:', error);
      } finally {
        setLoadingActive(false);
      }
    };

    const fetchCanceledOrders = async () => {
      try {
        const response = await fetch('https://api.guiawinelocals.com/api/users/orders?type=canceled', {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        setCanceledOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos cancelados:', error);
      } finally {
        setLoadingCanceled(false);
      }
    };

    fetchActiveOrders();
    fetchCanceledOrders();
  }, [jwt]);

  const renderOrdersList = (orders: any[], loading: boolean, emptyMessage: string) => {
    if (loading) {
      return <div className="text-center py-8">Carregando...</div>;
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Pedido #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <p className="font-bold text-burgundy-700">
                  R$ {order.total?.toFixed(2) || '0,00'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-2">Meus Pedidos</h1>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Pedidos Ativos</TabsTrigger>
            <TabsTrigger value="canceled">Pedidos Cancelados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            {renderOrdersList(activeOrders, loadingActive, "Nenhum pedido ativo encontrado")}
          </TabsContent>
          
          <TabsContent value="canceled" className="mt-4">
            {renderOrdersList(canceledOrders, loadingCanceled, "Nenhum pedido cancelado encontrado")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrdersList;
