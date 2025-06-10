
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

interface OrdersListProps {
  jwt: string;
  type: 'active' | 'canceled';
  onBack: () => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ jwt, type, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://api.guiawinelocals.com/api/users/orders?type=${type}`, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [jwt, type]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-2">
            {type === 'active' ? 'Meus Pedidos' : 'Pedidos Cancelados'}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default OrdersList;
