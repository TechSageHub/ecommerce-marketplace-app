import { useEffect, useState } from "react";
import OrderStatusBadge from "../components/admin/OrderStatusBadge";
import StatCard from "../components/admin/StatCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getOrders, updateOrderStatus } from "../services/orderService";
import { getProducts } from "../services/productService";
import formatCurrency from "../utils/formatCurrency";

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

function AdminDashboardPage() {
  const { token } = useAuth();
  const { showError, showLoading, updateToast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [productData, orderData] = await Promise.all([
          getProducts({ limit: 100 }),
          getOrders(token),
        ]);

        setProducts(productData.items || []);
        setOrders(orderData);
      } catch (err) {
        setError(err.message);
        showError(err.message, "Dashboard load failed");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockProducts = products.filter((product) => product.stock <= 5);
  const pendingOrders = orders.filter((order) => order.status === "pending");

  const handleStatusChange = async (orderId, status) => {
    const toastId = showLoading(
      `Updating order #${orderId} to ${status}.`,
      "Updating order"
    );

    try {
      setError("");
      const updatedOrder = await updateOrderStatus(orderId, status, token);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      updateToast(toastId, {
        type: "success",
        title: "Order updated",
        message: `Order #${orderId} is now marked as ${updatedOrder.status}.`,
      });
    } catch (err) {
      setError(err.message);
      updateToast(toastId, {
        type: "error",
        title: "Status update failed",
        message: err.message,
        duration: 4000,
      });
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#152842_56%,#1d3557_100%)] p-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_18%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
              Admin Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Business overview
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              A control room for products, revenue, and order movement with a cleaner,
              more confident visual presentation for live demos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-300">Revenue</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {loading ? "..." : formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-300">Orders</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {loading ? "..." : orders.length}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-300">Alerts</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {loading ? "..." : lowStockProducts.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-3xl bg-rose-100 px-5 py-4 text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Products"
          value={loading ? "..." : products.length}
          hint="All items currently in the catalog"
        />
        <StatCard
          label="Total Orders"
          value={loading ? "..." : orders.length}
          hint="Orders created from the checkout flow"
        />
        <StatCard
          label="Revenue"
          value={loading ? "..." : formatCurrency(totalRevenue)}
          hint="Combined order total from the database"
        />
        <StatCard
          label="Low Stock"
          value={loading ? "..." : lowStockProducts.length}
          hint="Products that need a stock refill soon"
        />
        <StatCard
          label="Pending Orders"
          value={loading ? "..." : pendingOrders.length}
          hint="Orders still waiting for action"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Recent Orders</h2>
            <span className="text-sm text-slate-400">{orders.length} total</span>
          </div>

          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-500">No orders yet.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300 hover:bg-white">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-slate-950">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <OrderStatusBadge status={order.status} />
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm capitalize"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {order.items.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                        >
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Inventory Alerts</h2>
            <span className="text-sm text-slate-400">Needs attention</span>
          </div>

          <div className="mt-6 space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-slate-500">All products have healthy stock.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                    {product.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
