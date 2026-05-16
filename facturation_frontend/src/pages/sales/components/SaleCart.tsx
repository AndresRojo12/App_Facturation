import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface SaleCartProps {
  items: CartItem[];
  onUpdateQuantity: (product_id: number, quantity: number) => void;
  onRemoveItem: (product_id: number) => void;
  onCheckout: () => void;
}

export function SaleCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: SaleCartProps) {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const calculatedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    setTotal(calculatedTotal);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Venta</h3>
        <p className="text-gray-500 text-center py-8">Agrega productos para comenzar una venta</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Venta</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-2">Producto</th>
              <th className="text-center py-2 px-2">Precio</th>
              <th className="text-center py-2 px-2">Cantidad</th>
              <th className="text-right py-2 px-2">Subtotal</th>
              <th className="text-center py-2 px-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product_id} className="border-b border-gray-100">
                <td className="py-3 px-2">
                  <p className="text-gray-900 font-medium">{item.product_name}</p>
                </td>
                <td className="py-3 px-2 text-center">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-medium">
                  ${item.subtotal.toFixed(2)}
                </td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => onRemoveItem(item.product_id)}
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-gray-200">
        <div className="flex justify-end mb-4">
          <div className="text-right">
            <p className="text-gray-600 text-sm mb-2">Total:</p>
            <p className="text-3xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Finalizar Venta
        </button>
      </div>
    </div>
  );
}
