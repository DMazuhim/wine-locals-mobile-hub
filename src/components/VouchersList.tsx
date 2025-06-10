
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Percent } from 'lucide-react';

interface VouchersListProps {
  jwt: string;
  onBack: () => void;
}

const VouchersList: React.FC<VouchersListProps> = ({ jwt, onBack }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('https://api.guiawinelocals.com/api/users/vouchers', {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        setVouchers(data);
      } catch (error) {
        console.error('Erro ao buscar cupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [jwt]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-2">Meus Cupons</h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-8">
            <Percent className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum cupom disponível</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((voucher: any) => (
              <Card key={voucher.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{voucher.code}</p>
                      <p className="text-sm text-gray-600">{voucher.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-burgundy-700">{voucher.discount}% OFF</p>
                      <p className="text-xs text-gray-500">
                        Válido até {new Date(voucher.expiresAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
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

export default VouchersList;
