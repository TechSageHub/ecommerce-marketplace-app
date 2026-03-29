import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useDelivery } from "../context/DeliveryContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductById, getProducts } from "../services/productService";
import formatCurrency from "../utils/formatCurrency";

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { deliveryZone } = useDelivery();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showError, showSuccess } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const currentProduct = await getProductById(id);
        setProduct(currentProduct);
        setQuantity(1);

        const relatedData = await getProducts({
          category: currentProduct.category,
          limit: 4,
        });

        setRelatedProducts(
          (relatedData.items || []).filter((item) => item.id !== currentProduct.id)
        );
      } catch (error) {
        showError(error.message, "Could not load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const stockStatus = useMemo(() => {
    if (!product) {
      return "";
    }

    if (product.stock === 0) {
      return "Out of stock";
    }

    if (product.stock <= 5) {
      return "Limited stock";
    }

    return "In stock";
  }, [product]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    for (let count = 0; count < quantity; count += 1) {
      addToCart(product);
    }

    showSuccess(`${product.name} added to cart.`, "Cart updated");
  };

  const handleToggleWishlist = () => {
    if (!product) {
      return;
    }

    const alreadySaved = isWishlisted(product.id);
    toggleWishlist(product);
    showSuccess(
      alreadySaved
        ? `${product.name} removed from wishlist.`
        : `${product.name} saved to wishlist.`,
      alreadySaved ? "Wishlist updated" : "Saved for later"
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[#6e675f]">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-rose-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[38px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_rgba(62,41,17,0.1)]">
          <div className="overflow-hidden rounded-[30px] bg-[#f4eadf]">
            <img
              src={product.image}
              alt={product.name}
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-[38px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(62,41,17,0.1)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8b6e4a]">
            {product.category}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#151515]">
            {product.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#6e675f]">
            Marketplace-style product detail page with stronger trust, quick actions,
            and a cleaner presentation for interviews.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-[#f68b1e] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(246,139,30,0.24)]">
              {stockStatus}
            </span>
            <span className="rounded-full bg-[#f8f3eb] px-4 py-2 text-sm text-[#54463a]">
              {product.stock} units available
            </span>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#f2dfc7] bg-[linear-gradient(180deg,#fff8ef_0%,#fff3e3_100%)] p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b6e4a]">
              Price
            </p>
            <p className="mt-3 text-4xl font-bold text-[#151515]">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-2 text-sm text-[#6e675f]">
              Delivery fees and payment options can be calculated at checkout.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#54463a]">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    Math.max(1, Math.min(Number(event.target.value) || 1, product.stock))
                  )
                }
                className="w-28 rounded-2xl border border-[#d8c7b1] bg-white px-4 py-3"
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-full bg-[#f68b1e] px-6 py-3 font-medium text-white shadow-[0_16px_30px_rgba(246,139,30,0.24)] transition hover:bg-[#db7e1d] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add to cart
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className="rounded-full border border-[#d8c7b1] bg-white px-6 py-3 font-medium text-[#54463a] transition hover:bg-[#f8f3eb]"
            >
              {isWishlisted(product.id) ? "Remove from wishlist" : "Save for later"}
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-[#f8f3eb] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">
                Delivery
              </p>
              <p className="mt-2 text-sm leading-6 text-[#54463a]">
                Fast delivery to {deliveryZone} and other major cities with marketplace-style logistics messaging.
              </p>
            </div>
            <div className="rounded-[24px] bg-[#f8f3eb] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">
                Payments
              </p>
              <p className="mt-2 text-sm leading-6 text-[#54463a]">
                Cards, transfer, and pay-on-delivery inspired checkout experience.
              </p>
            </div>
            <div className="rounded-[24px] bg-[#f8f3eb] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6e4a]">
                Returns
              </p>
              <p className="mt-2 text-sm leading-6 text-[#54463a]">
                Customer-friendly return messaging for a more complete marketplace feel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-12 rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(62,41,17,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8b6e4a]">
                Similar Items
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#151515]">
                Shoppers also explore
              </h2>
            </div>
            <Link to="/" className="text-sm font-medium text-[#f68b1e]">
              Back to store
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="rounded-[28px] border border-[#efe3d3] bg-[#fffaf4] p-4 transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(62,41,17,0.1)]"
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="h-48 w-full rounded-[22px] object-cover"
                />
                <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[#8b6e4a]">
                  {relatedProduct.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#151515]">
                  {relatedProduct.name}
                </h3>
                <p className="mt-3 text-base font-bold text-[#151515]">
                  {formatCurrency(relatedProduct.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ProductDetailPage;
