import { useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../components/admin/OrderStatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getOrdersByEmail, getMyOrders } from "../services/orderService";
import formatCurrency from "../utils/formatCurrency";

function AccountPage() {
  const { isAuthenticated, isCustomer, token, user, logout } = useAuth();
  const { showError, showLoading, updateToast } = useToast();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (event) => {
    event.preventDefault();

    if (!email) {
      showError("Enter the email used during checkout.", "Lookup blocked");
      return;
    }

    const toastId = showLoading("Finding your recent orders.", "Checking account");

    try {
      setLoading(true);
      const data = await getOrdersByEmail(email);
      setOrders(data);
      setSearched(true);
      updateToast(toastId, {
        type: "success",
        title: "Orders loaded",
        message: data.length
          ? "We found your recent marketplace orders."
          : "No orders found for that email yet.",
      });
    } catch (error) {
      updateToast(toastId, {
        type: "error",
        title: "Lookup failed",
        message: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMyOrders = async () => {
    const toastId = showLoading("Loading your account orders.", "Please wait");

    try {
      setLoading(true);
      const data = await getMyOrders(token);
      setOrders(data);
      setSearched(true);
      updateToast(toastId, {
        type: "success",
        title: "Account ready",
        message: "Your order history is now available.",
      });
    } catch (error) {
      updateToast(toastId, {
        type: "error",
        title: "Could not load account",
        message: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setOrders([]);
    setSearched(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-white/70 bg-[linear-gradient(180deg,#fffdf9_0%,#f7efe3_100%)] p-6 shadow-[0_24px_60px_rgba(62,41,17,0.08)] sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-[#8b6e4a]">
          Account & Orders
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#151515]">
          {isAuthenticated && isCustomer ? "Welcome back to your account" : "Track your marketplace orders"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e675f]">
          {isAuthenticated && isCustomer
            ? "View your saved account details and load your protected order history."
            : "Sign in for a richer customer account, or look up orders with the email used during checkout."}
        </p>

        {isAuthenticated && isCustomer ? (
          <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#8b6e4a]">
                Signed in as
              </p>
              <p className="mt-2 text-xl font-semibold text-[#151515]">{user?.name}</p>
              <p className="mt-1 text-sm text-[#6e675f]">{user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadMyOrders}
                className="rounded-full bg-[#f68b1e] px-5 py-3 text-sm font-medium text-white"
              >
                Load my orders
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#d8c7b1] bg-white px-5 py-3 text-sm font-medium text-[#54463a]"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full bg-[#151515] px-5 py-3 text-sm font-medium text-white"
              >
                Customer sign in
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-[#d8c7b1] bg-white px-5 py-3 text-sm font-medium text-[#54463a]"
              >
                Create account
              </Link>
            </div>

            <form onSubmit={handleLookup} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="customer@example.com"
                className="w-full rounded-full border border-[#d8c7b1] bg-white px-5 py-3 text-sm outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-[#f7c27d]/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#f68b1e] px-6 py-3 text-sm font-medium text-white shadow-[0_16px_30px_rgba(246,139,30,0.24)] transition hover:bg-[#db7e1d] disabled:bg-slate-300"
              >
                {loading ? "Checking..." : "Track orders"}
              </button>
            </form>
          </>
        )}
      </section>

      <section className="mt-10">
        {!searched ? (
          <div className="rounded-[32px] border border-dashed border-[#d8c7b1] bg-white/80 p-10 text-center text-[#6e675f] shadow-sm">
            Your recent orders will appear here after lookup.
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#d8c7b1] bg-white/80 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#151515]">
              No order history found
            </p>
            <p className="mt-3 text-sm leading-6 text-[#6e675f]">
              Try another email or place a new order from the storefront.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-[#151515] px-5 py-3 text-sm font-medium text-white"
            >
              Go shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(62,41,17,0.08)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8b6e4a]">
                      Order #{order.id}
                    </p>
                    <p className="mt-2 text-sm text-[#6e675f]">{order.customerEmail}</p>
                    <p className="mt-2 text-sm text-[#6e675f]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-[#151515]">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <div className="mt-3">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[24px] border border-[#efe3d3] bg-[#fffaf4] p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-[18px] object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#151515]">{item.name}</p>
                          <p className="mt-1 text-sm text-[#6e675f]">
                            Qty: {item.quantity}
                          </p>
                          <p className="mt-2 text-sm font-medium text-[#151515]">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AccountPage;
