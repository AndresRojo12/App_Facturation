import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle, CheckCircle } from "lucide-react";
import { SaleCart } from "./components/SaleCart";
import { api } from "../../services/api";

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
  type: "success" | "error" | "info";
  message: string;
}

interface SellerInfo {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
}

export function SaleForm() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seller, setSeller] = useState<SellerInfo>({ name: "Vendedor" });

  // Cargar productos y datos del vendedor al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchSellerData();
  }, []);

  // Buscar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.stock > 0,
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/products?offset=0&limit=10000", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(Array.isArray(response.data?.products) ? response.data.products.filter((p: any) => p.activo) : []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      showAlert("error", "Error al cargar los productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [userResponse, profileResponse] = await Promise.all([
        api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get("/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setSeller({
        name: profileResponse.data.full_name || userResponse.data.email || "Vendedor",
        email: userResponse.data.email,
        phone: profileResponse.data.phone || undefined,
        document: profileResponse.data.document || undefined,
      });
    } catch (error: any) {
      console.warn("No se pudo obtener los datos del vendedor:", error);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const userResponse = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSeller({ name: userResponse.data.email || "Vendedor", email: userResponse.data.email });
      } catch (fallbackError) {
        console.warn("No se pudo obtener el usuario en fallback:", fallbackError);
      }
    }
  };

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.product_id === product.id,
    );

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        updateQuantity(product.id, existingItem.quantity + 1);
        showAlert("info", `${product.name} - cantidad actualizada`);
      } else {
        showAlert("error", `No hay suficiente stock de ${product.name}`);
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
      showAlert("success", `${product.name} agregado al carrito`);
    }
    setSearchTerm("");
  };

  const updateQuantity = (product_id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product_id);
      return;
    }

    const product = products.find((p) => p.id === product_id);
    if (product && quantity > product.stock) {
      showAlert("error", `No hay suficiente stock`);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.product_id === product_id
        ? {
            ...item,
            quantity,
            subtotal: item.price * quantity,
          }
        : item,
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (product_id: number) => {
    const product = cartItems.find((item) => item.product_id === product_id);
    setCartItems(cartItems.filter((item) => item.product_id !== product_id));
    showAlert("info", `${product?.product_name} eliminado del carrito`);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showAlert("error", "El carrito está vacío");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const saleData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/sales/", saleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sale = response.data;
      // generar factura con datos del vendedor
      const invoice = {
        invoice_number: `FAC-${sale.id.toString().padStart(6, "0")}`,
        date: new Date().toLocaleDateString(),
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.subtotal, 0),
        seller: {
          name: seller.name,
          phone: seller.phone,
          document: seller.document,
        },
      };
      setInvoiceData(invoice);
      setShowInvoice(true);

      showAlert("success", "Venta realizada exitosamente");
      // limpiar carrito
      setCartItems([]);
      fetchProducts();
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      showAlert("error", "Error al realizar la venta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const printInvoice = () => {
  if (!invoiceData) return;

  const invoiceWindow = window.open("", "_blank");

  if (!invoiceWindow) return;

  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Factura ${invoiceData.invoice_number}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #111;
          }

          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }

          h1 {
            margin: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 12px;
            text-align: left;
          }

          th {
            background: #f5f5f5;
          }

          .total {
            margin-top: 30px;
            text-align: right;
          }

          .total h2 {
            color: #2563eb;
          }

          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }

          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div>
            <h1>FACTURA</h1>
            <p><strong>Número:</strong> ${invoiceData.invoice_number}</p>
            <p><strong>Fecha:</strong> ${invoiceData.date}</p>
          </div>

          <div>
            <h2>Facturación Pro</h2>
            <p>Sistema de Ventas</p>
            <p><strong>Vendedor:</strong> ${invoiceData.seller.name}</p>
            ${invoiceData.seller.phone ? `<p><strong>Teléfono:</strong> ${invoiceData.seller.phone}</p>` : ""}
            ${invoiceData.seller.document ? `<p><strong>Documento:</strong> ${invoiceData.seller.document}</p>` : ""}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            ${invoiceData.items
              .map(
                (item: CartItem) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${item.subtotal.toFixed(2)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total">
          <p>Total a pagar</p>
          <h2>$${invoiceData.total.toFixed(2)}</h2>
        </div>

        <div class="footer">
          Gracias por su compra
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>

      </body>
    </html>
  `);

  invoiceWindow.document.close();
};

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
            <p className="text-gray-600 mt-2">
              Busca productos y agrega cantidades para crear una venta
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200"
          >
            ← Cancelar
          </button>
        </div>

        {/* Alerts */}
        {alert && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : alert.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {alert.type === "success" ? (
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Buscar Productos
              </h2>

              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
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
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Stock: {product.stock} | $
                              {product.price.toFixed(2)}
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
      {showInvoice && invoiceData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Factura</h2>
                <p className="text-gray-600 mt-1">
                  Nº {invoiceData.invoice_number}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">Facturación Pro</p>
                <p className="text-sm text-gray-600">
                  Fecha: {invoiceData.date}
                </p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Producto</th>
                    <th className="text-center p-3">Cantidad</th>
                    <th className="text-right p-3">Precio</th>
                    <th className="text-right p-3">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {invoiceData.items.map((item: CartItem) => (
                    <tr key={item.product_id} className="border-t">
                      <td className="p-3">{item.product_name}</td>

                      <td className="text-center p-3">{item.quantity}</td>

                      <td className="text-right p-3">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="text-right p-3 font-medium">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">Datos del vendedor</p>
                <p>{invoiceData.seller.name}</p>
                {invoiceData.seller.email ? <p>{invoiceData.seller.email}</p> : null}
                {invoiceData.seller.phone ? <p>Tel: {invoiceData.seller.phone}</p> : null}
                {invoiceData.seller.document ? <p>Doc: {invoiceData.seller.document}</p> : null}
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-gray-600">Total a pagar</p>

                  <p className="text-4xl font-bold text-blue-600">
                    ${invoiceData.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button
                onClick={() => setShowInvoice(false)}
                className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
              >
                Cerrar
              </button>

              <button
                onClick={printInvoice}
                className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                🖨️ Imprimir/ Descargar Factura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
