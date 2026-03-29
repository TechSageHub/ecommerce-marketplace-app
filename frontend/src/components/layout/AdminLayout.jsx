import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { logoutAdmin } from "../../services/authService";

function AdminLayout() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoading, updateToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const toastId = showLoading("Signing you out of the admin dashboard.", "Logging out");

    try {
      await logoutAdmin(token);
      updateToast(toastId, {
        type: "success",
        title: "Logged out",
        message: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error(error);
      updateToast(toastId, {
        type: "error",
        title: "Logout issue",
        message: error.message,
        duration: 4000,
      });
    } finally {
      logout();
      navigate("/admin/login");
    }
  };

  const navigationLinks = [
    { to: "/admin/dashboard", label: "Overview" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/products/new", label: "Add Product" },
  ];

  const renderNavLinks = (orientation = "row") =>
    navigationLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `${orientation === "column" ? "block" : "inline-flex items-center"} rounded-2xl px-4 py-3 text-sm transition ${
            isActive
              ? "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/10"
              : "text-slate-300 hover:bg-white/10"
          }`
        }
      >
        {link.label}
      </NavLink>
    ));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f172a_0%,#111827_45%,#1f2937_100%)] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(15,23,42,0.9)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cyan-300">
                Dashboard
              </p>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">
                NovaCart Control
              </p>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
                {renderNavLinks()}
              </nav>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {user?.email}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-white/15 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen((current) => !current)}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-100 lg:hidden"
            >
              {isSidebarOpen ? "Close" : "Menu"}
            </button>
          </div>

          {isSidebarOpen ? (
            <div className="mt-4 rounded-[28px] border border-white/10 bg-white/5 p-4 lg:hidden">
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Signed In
                </p>
                <p className="mt-2 text-sm text-slate-200">{user?.email}</p>
              </div>

              <nav className="mt-4 space-y-3">{renderNavLinks("column")}</nav>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 w-full rounded-2xl border border-white/15 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto min-h-screen max-w-7xl">
        <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] p-6 text-slate-900 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
