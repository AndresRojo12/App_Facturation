import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface SaleDetail {
  product_id: number;
  quantity: number;
  price: number;
}

interface SaleRecord {
  id: number;
  total: number;
  created_at: string;
  seller_name?: string;
  details: SaleDetail[];
}

export default function InvoicesList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isHistory = location.pathname.includes("/history");

  useEffect(() => {
    fetchInvoices();
  }, [location.pathname]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token de autenticación.");
        return;
      }

      const response = await api.get("/sales", {
        params: isHistory ? undefined : { today: true },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (fetchError: any) {
      console.error("Error al cargar las facturas:", fetchError);
      setError(isHistory ? "No se pudo cargar el historial de facturas." : "No se pudieron cargar las facturas del día.");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Facturas
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {isHistory ? "Historial de facturas" : "Facturas del día"}
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              {isHistory
                ? "Revisa todas las facturas registradas en el sistema."
                : "Aquí ves el número real de facturas creadas hoy y los datos más recientes."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-slate-800"
            >
              ← Volver al Dashboard
            </button>
            <button
              onClick={() => navigate("/sales")}
              className="rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Ir a Punto de Venta
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div>
            <p className="text-sm text-slate-400">
              {isHistory ? "Total de facturas registradas" : "Total de facturas hoy"}
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {sales.length}
            </p>
          </div>
          <p className="text-slate-300 text-sm leading-6 max-w-xl">
            {isHistory
              ? "Esta página muestra todas las facturas históricas del sistema."
              : "Esta página muestra los registros de ventas creadas durante el día actual."}
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-800/70 bg-slate-900/70 shadow-xl shadow-slate-950/20">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950/90 text-slate-400">
              <tr>
                <th className="px-4 py-4 uppercase tracking-[0.2em]">N° Factura</th>
                <th className="px-4 py-4 uppercase tracking-[0.2em]">Fecha</th>
                <th className="px-4 py-4 uppercase tracking-[0.2em]">Vendedor</th>
                <th className="px-4 py-4 uppercase tracking-[0.2em]">Total</th>
                <th className="px-4 py-4 uppercase tracking-[0.2em]">Ítems</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 bg-slate-950">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    Cargando facturas...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    {isHistory
                      ? "No hay facturas registradas en el historial."
                      : "No hay facturas registradas para el día de hoy."}
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="transition hover:bg-slate-900/90">
                    <td className="px-4 py-4 font-medium text-white">
                      FAC-{sale.id.toString().padStart(6, "0")}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(sale.created_at).toLocaleString("es-PE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-4 text-slate-200">
                      {sale.seller_name || "Sin vendedor"}
                    </td>
                    <td className="px-4 py-4 text-cyan-300">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">{sale.details.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
