import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface ProfileForm {
  full_name: string;
  phone: string;
  document: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileForm>({
    full_name: "",
    phone: "",
    document: "",
  });
  const [email, setEmail] = useState<string>("");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined;
  };

  const fetchProfileData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const [userResponse, profileResponse] = await Promise.all([
        api.get("/users/me", {
          headers: getAuthHeaders(),
        }),
        api.get("/profile/me", {
          headers: getAuthHeaders(),
        }),
      ]);

      setEmail(userResponse.data.email);
      setProfileId(profileResponse.data.id);
      setFormData({
        full_name: profileResponse.data.full_name || "",
        phone: profileResponse.data.phone || "",
        document: profileResponse.data.document || "",
      });
    } catch (fetchError: any) {
      if (fetchError?.response?.status === 404) {
        try {
          const userResponse = await api.get("/users/me", {
            headers: getAuthHeaders(),
          });
          setEmail(userResponse.data.email);
        } catch (userError) {
          console.warn("No se pudo obtener el correo del usuario:", userError);
        }
      } else {
        console.warn("Error al cargar el perfil:", fetchError);
        setError("No se pudo cargar el perfil. Por favor intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("No se encontró token de autenticación.");
        return;
      }

      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        document: formData.document,
      };

      const response = profileId
        ? await api.put("/profile", payload, { headers })
        : await api.post("/profile", payload, { headers });

      setProfileId(response.data.id);
      setFormData({
        full_name: response.data.full_name || "",
        phone: response.data.phone || "",
        document: response.data.document || "",
      });
      setMessage("Perfil guardado correctamente.");
    } catch (saveError: any) {
      console.error("Error al guardar el perfil:", saveError);
      setError(
        saveError?.response?.data?.detail ||
          "No se pudo guardar el perfil. Verifica los datos e intenta nuevamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Perfil de usuario
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Completa tu perfil
            </h1>
            <p className="mt-2 text-slate-400">
              Actualiza tus datos para tener tu perfil completo y vinculado al
              sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Volver al Dashboard
          </button>
        </div>

        <div className="rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Correo registrado
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(event) =>
                  handleChange("full_name", event.target.value)
                }
                placeholder="Ingresa tu nombre completo"
                className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/80"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  placeholder="Ingresa tu teléfono"
                  className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Documento
                </label>
                <input
                  type="text"
                  value={formData.document}
                  onChange={(event) =>
                    handleChange("document", event.target.value)
                  }
                  placeholder="Ingresa tu documento"
                  className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/80"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-3xl bg-rose-500/15 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-3xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving || loading}
                className="flex-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar perfil"}
              </button>
              <button
                type="button"
                onClick={fetchProfileData}
                disabled={loading}
                className="flex-1 rounded-3xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-700"
              >
                {loading ? "Cargando..." : "Recargar perfil"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
