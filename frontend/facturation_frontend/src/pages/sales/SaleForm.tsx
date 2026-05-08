import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { SaleCart } from './components/SaleCart';
import { api } from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function SaleForm() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Buscar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.stock > 0
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/products/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      showAlert('error', 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        updateQuantity(product.id, existingItem.quantity + 1);
        showAlert('info', `${product.name} - cantidad actualizada`);
      } else {
        showAlert('error', `No hay suficiente stock de ${product.name}`);
      }
    } else {
      const newItem: CartItem = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      };
      setCartItems([...cartItems, newItem]);
      showAlert('success', `${product.name} agregado al carrito`);
    }
    setSearchTerm('');
  };

  const updateQuantity = (product_id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product_id);
      return;
    }

    const product = products.find((p) => p.id === product_id);
    if (product && quantity > product.stock) {
      showAlert('error', `No hay suficiente stock`);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.product_id === product_id
        ? {
            ...item,
            quantity,
            subtotal: item.price * quantity,
          }
        : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (product_id: number) => {
    const product = cartItems.find((item) => item.product_id === product_id);
    setCartItems(cartItems.filter((item) => item.product_id !== product_id));
    showAlert('info', `${product?.product_name} eliminado del carrito`);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showAlert('error', 'El carrito está vacío');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const saleData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post('/sales/', saleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showAlert('success', 'Venta realizada exitosamente');
      setCartItems([]);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error al realizar la venta:', error);
      showAlert('error', 'Error al realizar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
            <p className="text-gray-600 mt-2">Busca productos y agrega cantidades para crear una venta</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200"
          >
            ← Cancelar
          </button>
        </div>

        {/* Alerts */}
        {alert && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800'
                : alert.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Productos</h2>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Busca por nombre del producto (ej: arroz, azúcar, etc.)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search Results */}
              {searchTerm && (
                <div className="mt-4">
                  {loading ? (
                    <p className="text-gray-500">Cargando...</p>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              Stock: {product.stock} | ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                          >
                            Agregar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No se encontraron productos
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <SaleCart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
            {isSubmitting && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 font-medium">Procesando venta...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
