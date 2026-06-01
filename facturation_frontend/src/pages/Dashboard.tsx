import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import marketLogo from "../assets/market-pro.png";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Punto de Venta", path: "/sales" },
  { label: "Productos", path: "/products" },
  { label: "Facturas", path: "/invoices/history" },
  { label: "Perfil", path: "/profile" },
];

export default function Dashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [todayInvoicesCount, setTodayInvoicesCount] = useState(0);
  const [todaySalesAmount, setTodaySalesAmount] = useState(0);
  const [allInvoicesCount, setAllInvoicesCount] = useState(0);
  const [last7DaysSales, setLast7DaysSales] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("Administrador");
  const [userEmail, setUserEmail] = useState<string>("admin@sistema.com");
  const navigate = useNavigate();
  const location = useLocation();

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

      setProductsCount(response.data.total);
    } catch (error: any) {
      console.error("Error al obtener productos:", error);
      setProductsCount(0);
    }
  };

  const fetchTodayInvoicesCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      const response = await api.get("/sales", {
        params: { today: true },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sales = Array.isArray(response.data) ? response.data : [];
      setTodayInvoicesCount(sales.length);
      setTodaySalesAmount(
        sales.reduce(
          (total: number, sale: any) => total + Number(sale.total || 0),
          0,
        ),
      );
    } catch (error: any) {
      console.error("Error al obtener facturas del día:", error);
      setTodayInvoicesCount(0);
      setTodaySalesAmount(0);
    }
  };

  const fetchAllInvoicesCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      const response = await api.get("/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllInvoicesCount(
        Array.isArray(response.data) ? response.data.length : 0,
      );
    } catch (error: any) {
      console.error("Error al obtener el historial de facturas:", error);
      setAllInvoicesCount(0);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [profileResponse, userResponse] = await Promise.all([
        api.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const profileData = profileResponse.data || {};
      const userData = userResponse.data || {};

      setUserName(profileData.full_name || userData.email || "Administrador");
      setUserEmail(userData.email || "admin@sistema.com");
    } catch (error: any) {
      console.warn("No se pudo obtener los datos del usuario actual:", error);
    }
  };

  const fetchLast7DaysSales = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      console.log("DEBUG: Llamando a /sales/analytics/last-7-days");
      const response = await api.get("/sales/analytics/last-7-days", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("DEBUG: Respuesta del endpoint:", response.data);
      setLast7DaysSales(Array.isArray(response.data) ? response.data : []);
      console.log(
        "DEBUG: Estado last7DaysSales actualizado:",
        Array.isArray(response.data) ? response.data : [],
      );
    } catch (error: any) {
      console.error("Error al obtener ventas de últimos 7 días:", error);
      setLast7DaysSales([]);
    }
  };

  // Cargar la cantidad de productos y facturas al montar el componente
  useEffect(() => {
    fetchProductsCount();
    fetchTodayInvoicesCount();
    fetchAllInvoicesCount();
    fetchLast7DaysSales();
    fetchCurrentUser();
  }, []);

  // Tarjetas de resumen con datos dinámicos
  const summaryCards = [
    {
      title: "Ventas del día",
      value: `$${todaySalesAmount.toFixed(2)}`,
      change: "+12.5% vs ayer",
      icon: "💵",
      bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
    },
    {
      title: "Facturas del día",
      value: todayInvoicesCount,
      change: "+8.3% vs ayer",
      icon: "🧾",
      bg: "bg-gradient-to-r from-violet-500 to-purple-600",
    },
    {
      title: "Ver facturas",
      value: allInvoicesCount,
      change: "Historial completo",
      icon: "📜",
      bg: "bg-gradient-to-r from-yellow-500 to-orange-600",
    },
    {
      title: "Productos",
      value: productsCount,
      change: "En inventario",
      icon: "📦",
      bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
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
              <img src={marketLogo} alt="Market Pro" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Facturación
              </p>
              <h2 className="text-lg font-semibold text-white">
                Market Pro
              </h2>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm transition ${
                  location.pathname === item.path
                    ? "bg-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/10"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {location.pathname === item.path ? (
                  <span className="text-xs">•</span>
                ) : null}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="mt-10 flex w-full items-center justify-center rounded-3xl border border-slate-700/60 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-slate-900"

          >
            <span>Cerrar sesión</span>
            <span className="text-xs"></span>
          </button>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white">
                Hola, {userName}
              </h1>
              <p className="mt-2 max-w-2xl text-slate-400">
                Revisa tus métricas clave y administra productos, facturas y
                clientes desde aquí.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 shadow-xl shadow-slate-950/20">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                👤
              </div>
              <div>
                <p className="font-medium text-white">{userName}</p>
                <p className="text-sm text-slate-400">{userEmail}</p>
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
                  if (card.title === "Ventas del día") {
                    navigate("/sales/daily");
                  }
                  if (card.title === "Facturas del día") {
                    navigate("/invoices");
                  }
                  if (card.title === "Ver facturas") {
                    navigate("/invoices/history");
                  }
                }}
                className={`rounded-3xl p-5 shadow-2xl shadow-slate-950/25 ${card.bg} transition ${
                  card.title === "Productos" ||
                  card.title === "Ventas del día" ||
                  card.title === "Facturas del día" ||
                  card.title === "Ver facturas"
                    ? "hover:shadow-2xl hover:scale-105 cursor-pointer"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-200/90">
                      {card.title}
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {card.value}
                    </p>
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
                  <h2 className="text-xl font-semibold text-white">
                    Ventas últimos 7 días
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Resumen de ingresos y crecimiento reciente.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
                  Gráfico rápido
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="overflow-hidden rounded-[2rem] bg-slate-950/900 p-4">
                  {last7DaysSales.length > 0 ? (
                    <>
                      <div className="relative h-72 overflow-hidden rounded-[2rem] bg-gradient-to-b from-cyan-500/10 via-slate-950/10 to-slate-950/0 p-4">
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-cyan-400 to-violet-500 opacity-40" />
                        <svg
                          viewBox="0 0 700 250"
                          className="h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="lineGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <linearGradient
                              id="fillGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="rgba(34,211,238,0.3)"
                              />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          {(() => {
                            const maxAmount = Math.max(
                              ...last7DaysSales.map((d) => d.total_amount),
                              1,
                            );
                            const points = last7DaysSales.map((day, i) => ({
                              x:
                                (i / (last7DaysSales.length - 1 || 1)) * 680 +
                                10,
                              y: 230 - (day.total_amount / maxAmount) * 200,
                              amount: day.total_amount,
                              products: day.total_products,
                            }));

                            const pathData = points
                              .map(
                                (p, i) =>
                                  `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`,
                              )
                              .join(" ");

                            const fillPath = `${pathData} L ${points[points.length - 1]?.x} 230 L 10 230 Z`;

                            return (
                              <>
                                <path
                                  d={fillPath}
                                  fill="url(#fillGradient)"
                                  opacity="0.7"
                                />
                                <path
                                  d={pathData}
                                  fill="none"
                                  stroke="url(#lineGradient)"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                {points.map((p, i) => (
                                  <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="5"
                                    fill="#38bdf8"
                                    stroke="#fff"
                                    strokeWidth="2"
                                  />
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      <div className="mt-6 grid grid-cols-7 gap-2">
                        {last7DaysSales.map((day, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-700/60 bg-slate-950/50 p-3 text-center"
                          >
                            <p className="text-xs text-slate-400 uppercase">
                              {day.day_short}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-cyan-300">
                              ${day.total_amount.toFixed(0)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {day.total_products} productos
                            </p>
                            <p className="text-xs text-slate-600">
                              {day.sales_count} venta
                              {day.sales_count !== 1 ? "s" : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-16">
                      <p className="text-slate-400">
                        Sin datos de ventas en los últimos 7 días
                      </p>
                    </div>
                  )}
                </div>
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
                <h3 className="text-2xl font-semibold text-white">
                  Cerrar sesión
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  ¿Seguro que deseas cerrar sesión? Puedes volver a iniciar
                  sesión cuando quieras.
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
