import { useState } from "react";
import CartItem from "../components/cart/CartItem";
import { useCart } from "../context/CartContext";
import { useDelivery } from "../context/DeliveryContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/orderService";
import formatCurrency from "../utils/formatCurrency";

function CartPage() {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { deliveryZone, setDeliveryZone } = useDelivery();
  const { showError, showLoading, updateToast } = useToast();
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const deliveryFee = deliveryZone === "Lagos" ? 2500 : deliveryZone === "Abuja" ? 3500 : 4500;
  const serviceFee = cartTotal * 0.015;
  const grandTotal = cartTotal + deliveryFee + serviceFee;

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (!customerEmail) {
      showError("Please enter your email address.", "Checkout blocked");
      return;
    }

    if (cartItems.length === 0) {
      showError("Your cart is empty.", "Checkout blocked");
      return;
    }

    const toastId = showLoading("Creating your order now.", "Processing checkout");

    try {
      setLoading(true);

      const response = await createOrder({
        customerEmail,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      updateToast(toastId, {
        type: "success",
        title: "Order placed",
        message: `Order #${response.order.id} was created for ${response.order.customerEmail}.`,
      });
      setCustomerEmail("");
      clearCart();
    } catch (err) {
      updateToast(toastId, {
        type: "error",
        title: "Checkout failed",
        message: err.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
      <section>
        <p className="text-sm uppercase tracking-[0.35em] text-[#8b6e4a]">
          Shopping Cart
        </p>
        <h1 className="mt-2 text-4xl font-bold text-[#151515] sm:text-5xl">Review your cart</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#6e675f]">
          A calm checkout experience with stronger hierarchy, warmer surfaces, and a more
          presentation-ready visual style.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">Step 1</p>
            <p className="mt-2 font-semibold text-[#151515]">Review cart</p>
          </div>
          <div className="rounded-[24px] border border-[#f0c78b] bg-[#fff5e4] p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">Step 2</p>
            <p className="mt-2 font-semibold text-[#151515]">Confirm delivery</p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">Step 3</p>
            <p className="mt-2 font-semibold text-[#151515]">Place order</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {cartItems.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#cdbca7] bg-[rgba(255,250,244,0.92)] p-10 text-center text-[#6e675f]">
              Your cart is empty. Add some products from the storefront.
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onChangeQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>
      </section>

      <aside className="relative overflow-hidden rounded-[36px] border border-black/5 bg-[linear-gradient(180deg,#151515_0%,#231a15_100%)] p-6 text-[#fffaf4] shadow-[0_28px_70px_rgba(21,21,21,0.22)]">
        <div className="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[#f0c78b]/15 blur-3xl" />
        <h2 className="text-2xl font-bold">Checkout</h2>
        <p className="mt-2 text-sm text-[#d9d0c6]">
          This starter keeps checkout simple, but the structure is ready to grow.
        </p>

        <div className="mt-6 rounded-[28px] bg-white/5 p-5">
          <div className="flex items-center justify-between text-sm text-[#d9d0c6]">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#d9d0c6]">
            <span>Items subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#d9d0c6]">
            <span>Delivery fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#d9d0c6]">
            <span>Service fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xl font-bold text-[#fffaf4]">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#e6ddd2]">
              Delivery Zone
            </label>
            <select
              value={deliveryZone}
              onChange={(event) => setDeliveryZone(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900"
            >
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Other">Other states</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#e6ddd2]">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              placeholder="customer@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full rounded-full bg-[#f0c78b] px-5 py-3 font-medium text-[#151515] transition hover:bg-[#e5b76d] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Placing order..." : "Checkout"}
          </button>

          <p className="text-xs leading-6 text-[#d9d0c6]">
            By checking out, you confirm your delivery zone and agree to the marketplace-style order summary shown above.
          </p>
        </form>
      </aside>
    </div>
  );
}

export default CartPage;
