import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginCustomer, registerCustomer } from "../services/authService";

const initialLoginState = {
  email: "",
  password: "",
};

const initialRegisterState = {
  name: "",
  email: "",
  password: "",
};

function CustomerAuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showLoading, updateToast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState(initialLoginState);
  const [registerData, setRegisterData] = useState(initialRegisterState);
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((current) => ({ ...current, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((current) => ({ ...current, [name]: value }));
  };

  const handleCustomerLogin = async (event) => {
    event.preventDefault();
    const toastId = showLoading("Signing you in to your customer account.", "Please wait");

    try {
      setLoading(true);
      const response = await loginCustomer(loginData);
      login({
        token: response.token,
        user: response.user,
      });
      updateToast(toastId, {
        type: "success",
        title: "Welcome back",
        message: "You are now signed in.",
      });
      navigate("/account");
    } catch (error) {
      updateToast(toastId, {
        type: "error",
        title: "Login failed",
        message: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegister = async (event) => {
    event.preventDefault();
    const toastId = showLoading("Creating your marketplace account.", "Creating account");

    try {
      setLoading(true);
      const response = await registerCustomer(registerData);
      login({
        token: response.token,
        user: response.user,
      });
      updateToast(toastId, {
        type: "success",
        title: "Account ready",
        message: "Your customer account has been created.",
      });
      navigate("/account");
    } catch (error) {
      updateToast(toastId, {
        type: "error",
        title: "Registration failed",
        message: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(246,139,30,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,35,23,0.1),transparent_22%),linear-gradient(180deg,#fffaf4_0%,#f5ecdf_100%)] px-4 lg:grid-cols-[1fr_0.95fr]">
      <div className="hidden flex-col justify-between p-14 lg:flex">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-[#8b6e4a]">
            NovaCart Shopper
          </p>
          <h1 className="mt-6 max-w-xl text-6xl font-bold leading-[1.02] text-[#151515]">
            Sign in faster, save favorites, and track every order.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#6e675f]">
            Customer accounts now make the marketplace flow feel more complete with saved items, order history, and a smoother repeat-shopping experience.
          </p>
        </div>

        <div className="grid max-w-xl grid-cols-2 gap-4">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">Wishlist</p>
            <p className="mt-3 text-2xl font-bold text-[#151515]">Saved items</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">Orders</p>
            <p className="mt-3 text-2xl font-bold text-[#151515]">Trackable</p>
          </div>
        </div>
      </div>

      <div className="grid place-items-center py-10">
        <div className="w-full max-w-xl rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_60px_rgba(62,41,17,0.12)]">
          <div className="flex rounded-full bg-[#f7efe4] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                activeTab === "login"
                  ? "bg-[#151515] text-white"
                  : "text-[#6e675f]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                activeTab === "register"
                  ? "bg-[#151515] text-white"
                  : "text-[#6e675f]"
              }`}
            >
              Create account
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleCustomerLogin} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
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
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#f68b1e] px-5 py-3 font-medium text-white transition hover:bg-[#db7e1d] disabled:bg-slate-300"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCustomerRegister} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
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
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#151515] px-5 py-3 font-medium text-white transition hover:bg-[#2f2a26] disabled:bg-slate-300"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          )}

          <Link to="/" className="mt-6 inline-block text-sm font-medium text-slate-500">
            Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerAuthPage;
