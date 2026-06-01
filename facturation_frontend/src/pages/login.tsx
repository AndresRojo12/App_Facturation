import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface AuthLayoutProps {
  onLogin: (token: string | null) => void;
}

function AuthLayout({ onLogin }: AuthLayoutProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/users/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", response.data.access_token);
      onLogin(response.data.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            INICIAR SESIÓN
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "INICIAR SESIÓN"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              ¿No tienes cuenta? Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
