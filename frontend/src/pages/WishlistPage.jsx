import { Link } from "react-router-dom";
import ProductCard from "../components/store/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";

function WishlistPage() {
  const { addToCart } = useCart();
  const { wishlistItems } = useWishlist();
  const { showSuccess } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product);
    showSuccess(`${product.name} was added to your cart.`, "Added to cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,#fffdf9_0%,#f8efe4_100%)] p-6 shadow-[0_24px_60px_rgba(62,41,17,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#8b6e4a]">
          Wishlist
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#151515]">
          Saved for later
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e675f]">
          Keep products you want to revisit, compare, or add to cart later just like a modern marketplace experience.
        </p>
      </div>

      <div className="mt-8">
        {wishlistItems.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#d8c7b1] bg-white/80 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#151515]">
              Your wishlist is empty
            </p>
            <p className="mt-3 text-sm leading-6 text-[#6e675f]">
              Save products while browsing so you can come back to them quickly.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-[#f68b1e] px-5 py-3 text-sm font-medium text-white shadow-[0_16px_30px_rgba(246,139,30,0.24)]"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
