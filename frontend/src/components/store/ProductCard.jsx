import formatCurrency from "../../utils/formatCurrency";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";

function ProductCard({ product, onAddToCart }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showSuccess } = useToast();

  const handleToggleWishlist = () => {
    const saved = isWishlisted(product.id);
    toggleWishlist(product);
    showSuccess(
      saved
        ? `${product.name} removed from wishlist.`
        : `${product.name} saved to wishlist.`,
      "Wishlist updated"
    );
  };

  return (
    <article className="group overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.98)_0%,rgba(248,239,229,0.92)_100%)] shadow-[0_24px_60px_rgba(55,36,18,0.12)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(55,36,18,0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#efe2d3]">
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_35%,rgba(21,21,21,0.14)_100%)]" />
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#8b6e4a] backdrop-blur">
          {product.category}
        </div>
        <div className="absolute bottom-4 left-4 z-10 rounded-full bg-[#151515]/70 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#fffaf4] backdrop-blur">
          NovaCart Select
        </div>
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[#54463a] shadow-sm"
        >
          {isWishlisted(product.id) ? "Saved" : "Save"}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to={`/products/${product.id}`}>
              <h3 className="text-xl font-semibold text-[#151515] transition hover:text-[#f68b1e] sm:text-2xl">
                {product.name}
              </h3>
            </Link>
            <p className="mt-2 max-w-[16rem] text-sm leading-6 text-[#6e675f]">
              Designed for polished everyday shopping and an elevated retail impression.
            </p>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-2 text-lg font-bold text-[#151515] shadow-sm">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#e6dacb] pt-5">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#9f8768]">
              Availability
            </p>
            <p className="mt-1 text-sm text-[#6e675f]">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.id}`}
              className="rounded-full border border-[#d8c7b1] bg-white px-4 py-2.5 text-sm font-medium text-[#54463a] transition hover:bg-[#f8f3eb]"
            >
              View
            </Link>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="rounded-full bg-[#151515] px-5 py-2.5 text-sm font-medium text-[#fffaf4] shadow-[0_12px_24px_rgba(21,21,21,0.16)] transition hover:bg-[#8b6e4a] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
