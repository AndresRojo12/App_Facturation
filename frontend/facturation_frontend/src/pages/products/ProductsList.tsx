import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm, { type ProductFormData } from "./ProductForm";
import { api } from "../../services/api";

export default function ProductsList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  }

  async function handleCreateProduct(formData: ProductFormData) {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token de autenticación");
        navigate("/", { replace: true });
        return;
      }

      // Preparar los datos para enviar al backend
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        activo: formData.activo,
      };

      // Enviar la solicitud POST a la API
      const response = await api.post("/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Producto creado exitosamente:", response.data);

      // Cerrar el modal
      setShowCreateModal(false);

      // Aquí podrías actualizar la lista de productos si tienes estado para ello
      // Por ahora solo mostramos un mensaje de éxito
      alert("Producto creado exitosamente");

    } catch (error: any) {
      console.error("Error al crear producto:", error);

      if (error.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
      } else if (error.response?.status === 422) {
        setError("Datos inválidos. Por favor, verifica la información ingresada.");
      } else {
        setError(error.response?.data?.detail || "Error al crear el producto");
      }
    } finally {
      setIsLoading(false);
    }
  }


useEffect(() => {
  fetchProducts();
}, []);

async function fetchProducts() {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Productos:", response.data);
    setProducts(response.data);

  } catch (error: any) {
    console.error("Error al obtener productos:", error);
  }
}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block border-r border-slate-800/80 bg-slate-900/90 p-6">
          <div className="mb-10 flex items-center gap-3 rounded-3xl bg-slate-950/80 p-4 shadow-xl shadow-slate-950/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-2xl text-cyan-300">
              💼
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Facturación</p>
              <h2 className="text-lg font-semibold text-white">Facturación Pro</h2>
            </div>
          </div>

          <nav className="space-y-2">
            {products.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.label === "Dashboard") navigate("/dashboard");
                }}
                className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm transition ${
                  item.active
                    ? "bg-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/10"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.active ? <span className="text-xs">•</span> : null}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="mt-10 flex w-full items-center justify-center rounded-3xl border border-slate-700/60 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-slate-900"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Gestión</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Productos</h1>
              <p className="mt-2 max-w-2xl text-slate-400">
                Administra tu catálogo de productos, precios e inventario.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
            >
              ➕ Crear producto
            </button>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-800/70 bg-slate-900/70 shadow-xl shadow-slate-950/20">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="border-b border-slate-800/70 bg-slate-950/90 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.15em]">ID</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.15em]">Nombre</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.15em]">Precio</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.15em]">Stock</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.15em]">Estado</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.15em]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 bg-slate-950">
                  {products.map((product) => (
                    <tr key={product.id} className="transition hover:bg-slate-900/90">
                      <td className="px-6 py-4 font-medium text-cyan-300">{product.id}</td>
                      <td className="px-6 py-4 text-white">{product.name}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">{product.price}</td>
                      <td className="px-6 py-4 text-slate-300">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            product.status === "Activo"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : product.activo === "Bajo stock"
                              ? "bg-amber-500/10 text-amber-300"
                              : "bg-rose-500/10 text-rose-300"
                          }`}
                        >
                          {product.activo ? "Activo" : product.stock < 5 ? "Bajo stock" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-between rounded-2xl border border-slate-800/70 bg-slate-900/50 px-6 py-4">
            <div className="text-sm text-slate-400">
              Total de productos: <span className="font-semibold text-white">{products.length}</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
              >
                ← Anterior
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </main>
      </div>

      {showCreateModal && (
        <ProductForm
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProduct}
          isLoading={isLoading}
          error={error}
        />
      )}

      {showLogoutModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-700/80 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">Cerrar sesión</h3>
                <p className="mt-2 text-sm text-slate-400">
                  ¿Seguro que deseas cerrar sesión? Puedes volver a iniciar sesión cuando quieras.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-full bg-slate-800/90 px-3 py-2 text-slate-300 transition hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110"
              >
                Sí, cerrar sesión
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Seguir en la app
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}