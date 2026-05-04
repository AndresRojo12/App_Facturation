import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const invoiceRows = [
  { id: "F001-000018", client: "María López", date: "25/05/2024", total: "$120.00", status: "Pagada" },
  { id: "F001-000017", client: "Carlos Pérez", date: "25/05/2024", total: "$85.50", status: "Pagada" },
  { id: "F001-000016", client: "Ana Gómez", date: "25/05/2024", total: "$230.00", status: "Pagada" },
  { id: "F001-000015", client: "Juan Martínez", date: "24/05/2024", total: "$75.00", status: "Cancelada" },
  { id: "F001-000014", client: "Pedro Ruiz", date: "24/05/2024", total: "$150.00", status: "Pagada" },
];

const navigationItems = [
  { label: "Dashboard", active: true },
  { label: "Punto de Venta", active: false },
  { label: "Productos", active: false },
  { label: "Facturas", active: false },
  { label: "Clientes", active: false },
  { label: "Reportes", active: false },
  { label: "Usuarios", active: false },
  { label: "Configuración", active: false },
];

export default function Dashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const navigate = useNavigate();

  // Función para obtener la cantidad de productos
  const fetchProductsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductsCount(response.data.length);
    } catch (error: any) {
      console.error("Error al obtener productos:", error);
      // En caso de error, mantener el valor actual o mostrar 0
      setProductsCount(0);
    }
  };

  // Cargar la cantidad de productos al montar el componente
  useEffect(() => {
    fetchProductsCount();
  }, []);

  // Tarjetas de resumen con datos dinámicos
  const summaryCards = [
    {
      title: "Ventas del día",
      value: "$1,250.00",
      change: "+12.5% vs ayer",
      icon: "💵",
      bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
    },
    {
      title: "Facturas del día",
      value: 18,
      change: "+8.3% vs ayer",
      icon: "🧾",
      bg: "bg-gradient-to-r from-violet-500 to-purple-600",
    },
    {
      title: "Productos",
      value: productsCount,
      change: "En inventario",
      icon: "📦",
      bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    },
    {
      title: "Clientes",
      value: 156,
      change: "Registrados",
      icon: "👥",
      bg: "bg-gradient-to-r from-orange-500 to-rose-600",
    },
  ];

  function handleLogout() {
    // eliminar token
    localStorage.removeItem("token");

    // eliminar otros datos si existen
    localStorage.removeItem("user");

    // cerrar modal
    setShowLogoutModal(false);

    // redirigir al login principal
    navigate("/", { replace: true });
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
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.label === "Productos") navigate("/products");
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
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Hola, Administrador</h1>
              <p className="mt-2 max-w-2xl text-slate-400">
                Revisa tus métricas clave y administra productos, facturas y clientes desde aquí.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 shadow-xl shadow-slate-950/20">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                👤
              </div>
              <div>
                <p className="font-medium text-white">Administrador</p>
                <p className="text-sm text-slate-400">admin@sistema.com</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => {
                  if (card.title === "Productos") {
                    navigate("/products");
                  }
                }}
                className={`rounded-3xl p-5 shadow-2xl shadow-slate-950/25 ${card.bg} transition ${
                  card.title === "Productos" 
                    ? "hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-105 cursor-pointer"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-200/90">{card.title}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    {card.icon}
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-200/80">{card.change}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Ventas últimos 7 días</h2>
                  <p className="mt-1 text-sm text-slate-400">Resumen de ingresos y crecimiento reciente.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
                  Gráfico rápido
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[2rem] bg-slate-950/90 p-4">
                <div className="relative h-72 overflow-hidden rounded-[2rem] bg-gradient-to-b from-cyan-500/10 via-slate-950/10 to-slate-950/0 p-4">
                  <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-cyan-400 to-violet-500 opacity-40" />
                  <svg viewBox="0 0 300 200" className="h-full w-full">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                      <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 150 C 65 130 110 100 150 115 C 190 130 230 95 290 70" fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 10 150 C 65 130 110 100 150 115 C 190 130 230 95 290 70 L 290 180 L 10 180 Z" fill="url(#fillGradient)" opacity="0.7" />
                    {[10, 65, 110, 150, 190, 230, 290].map((x, index) => (
                      <circle key={index} cx={x} cy={[150, 130, 100, 115, 130, 95, 70][index]} r="6" fill="#38bdf8" stroke="#fff" strokeWidth="2" />
                    ))}
                  </svg>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Últimas facturas</h2>
                  <p className="mt-1 text-sm text-slate-400">Las facturas más recientes del sistema.</p>
                </div>
                <button className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-white transition hover:bg-slate-700/90">
                  Ver todas
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-800/60 bg-slate-950/80">
                <table className="min-w-full text-left text-sm text-slate-200">
                  <thead className="bg-slate-950/90 text-slate-400">
                    <tr>
                      <th className="px-4 py-4 uppercase tracking-[0.2em]">N° Factura</th>
                      <th className="px-4 py-4 uppercase tracking-[0.2em]">Cliente</th>
                      <th className="px-4 py-4 uppercase tracking-[0.2em]">Fecha</th>
                      <th className="px-4 py-4 uppercase tracking-[0.2em]">Total</th>
                      <th className="px-4 py-4 uppercase tracking-[0.2em]">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 bg-slate-950">
                    {invoiceRows.map((invoice) => (
                      <tr key={invoice.id} className="transition hover:bg-slate-900/90">
                        <td className="px-4 py-4 font-medium text-white">{invoice.id}</td>
                        <td className="px-4 py-4">{invoice.client}</td>
                        <td className="px-4 py-4">{invoice.date}</td>
                        <td className="px-4 py-4 text-cyan-300">{invoice.total}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            invoice.status === "Pagada"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : invoice.status === "Pendiente"
                              ? "bg-amber-500/10 text-amber-300"
                              : "bg-rose-500/10 text-rose-300"
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

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

