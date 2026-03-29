import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginAdmin } from "../services/authService";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showLoading, updateToast } = useToast();
  const [formData, setFormData] = useState({
    email: "admin@yourstore.com",
    password: "Admin123!",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const toastId = showLoading("Checking your admin credentials.", "Signing in");

    try {
      setLoading(true);
      const response = await loginAdmin(formData);

      login({
        token: response.token,
        user: response.user,
      });

      updateToast(toastId, {
        type: "success",
        title: "Welcome back",
        message: "Admin login successful.",
      });
      navigate("/admin/dashboard");
    } catch (err) {
      updateToast(toastId, {
        type: "error",
        title: "Login failed",
        message: err.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] px-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden lg:flex flex-col justify-between p-14 text-white">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-cyan-300">
            NovaCart Admin
          </p>
          <h1 className="mt-6 max-w-xl text-6xl font-bold leading-[1.02]">
            A sharper control room for your store operations.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Manage products, update order flow, and keep the storefront moving
            without losing visual clarity.
          </p>
        </div>

        <div className="grid max-w-xl grid-cols-2 gap-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Catalog</p>
            <p className="mt-3 text-2xl font-bold">Searchable</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Orders</p>
            <p className="mt-3 text-2xl font-bold">Trackable</p>
          </div>
        </div>
      </div>

      <div className="grid place-items-center py-10">
        <div className="w-full max-w-md rounded-[36px] border border-white/10 bg-white p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">
            Admin Portal
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage products, stock, and customer orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:bg-slate-300"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <Link to="/" className="mt-6 inline-block text-sm font-medium text-slate-500">
            Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
