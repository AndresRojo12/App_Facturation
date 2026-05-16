import { useState, useEffect } from "react";

interface ProductUpdateProps {
  product: any;
  onClose: () => void;
  onSubmit: (formData: ProductUpdateData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface ProductUpdateData {
  name: string;
  price: string;
  stock: string;
  activo: boolean;
}

export default function ProductUpdate({
  product,
  onClose,
  onSubmit,
  isLoading = false,
  error,
}: ProductUpdateProps) {
  const [UpdateFormData, setUpdateFormData] = useState<ProductUpdateData>({
    name: product?.name || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    activo: product?.activo ?? true,
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(UpdateFormData);
    setUpdateFormData({ name: "", price: "", stock: "", activo: true });
  }
  useEffect(() => {
    if (product) {
      setUpdateFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        activo: product.activo ?? true,
      });
    }
  }, [product]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-slate-700/80 bg-slate-900 p-8 shadow-2xl shadow-slate-950/60">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Actualizar producto
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Completa los campos para actualizar la información del producto.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full bg-slate-800/90 px-3 py-2 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Nombre del producto
            </label>
            <input
              type="text"
              name="name"
              value={UpdateFormData.name}
              onChange={handleInputChange}
              placeholder="Ej: Laptop Pro 15"
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={UpdateFormData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Stock inicial
              </label>
              <input
                type="number"
                name="stock"
                value={UpdateFormData.stock}
                onChange={handleInputChange}
                placeholder="0"
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="activo"
              checked={UpdateFormData.activo}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label className="text-sm font-medium text-slate-200">
              Producto activo
            </label>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "⏳ Actualizando..." : "✓ Actualizar producto"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
