import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/store/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProducts } from "../services/productService";

const MARKETPLACE_HIGHLIGHTS = [
  "Official store deals",
  "Flash sale discounts",
  "Pay on delivery available",
  "Nationwide doorstep delivery",
];

const SERVICE_TILES = [
  { title: "Phones & Tablets", hint: "Best prices on mobile essentials" },
  { title: "Fashion", hint: "Trending looks and everyday wear" },
  { title: "Electronics", hint: "Sound, screens, and smart devices" },
  { title: "Supermarket", hint: "Daily essentials and quick restock" },
];

const HERO_SLIDES = [
  {
    eyebrow: "Interview Edition",
    title: "A premium storefront with a polished retail identity.",
    body:
      "NovaCart now feels closer to a presentable brand demo: elegant merchandising, stronger visual hierarchy, and an admin experience that looks intentional instead of generic.",
  },
  {
    eyebrow: "Mega Deals",
    title: "Marketplace-style promotions that feel fast, visible, and high energy.",
    body:
      "Rotating campaign messaging gives the homepage a more active sales feel, similar to a large commerce platform.",
  },
  {
    eyebrow: "Trusted Checkout",
    title: "Built to look dependable from discovery to order tracking.",
    body:
      "With wishlist, delivery selection, cart totals, and order lookup, the shopping flow feels more complete and business-ready.",
  },
];

function StorefrontPage() {
  const { addToCart } = useCart();
  const { showError, showSuccess } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalItems: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const [pagedData, allData] = await Promise.all([
          getProducts({
            category: selectedCategory,
            search: searchTerm,
            page,
            limit: 6,
          }),
          getProducts({ limit: 100 }),
        ]);
        setProducts(pagedData.items);
        setPagination(pagedData.pagination);
        setAllProducts(allData.items);
      } catch (err) {
        setError(err.message);
        showError(err.message, "Could not load storefront");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, searchTerm, selectedCategory]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (searchTerm) {
      nextParams.set("search", searchTerm);
    }

    if (selectedCategory && selectedCategory !== "All") {
      nextParams.set("category", selectedCategory);
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchTerm, selectedCategory, setSearchParams]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 4200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(allProducts.map((product) => product.category))],
    [allProducts]
  );
  const featuredProducts = products.slice(0, 4);
  const spotlightProducts = allProducts.slice(0, 8);

  const handleAddToCart = (product) => {
    addToCart(product);
    showSuccess(`${product.name} was added to your cart.`, "Added to cart");
  };

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[260px_1fr_280px]">
          <aside className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_rgba(62,41,17,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.38em] text-[#8b6e4a]">
              Categories
            </p>
            <div className="mt-5 space-y-3">
              {categories.slice(0, 10).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                    selectedCategory === category
                      ? "bg-[#f68b1e] text-white shadow-[0_12px_28px_rgba(246,139,30,0.28)]"
                      : "bg-[#f8f3eb] text-[#54463a] hover:bg-[#f2e8db]"
                  }`}
                >
                  <span>{category}</span>
                  <span>{selectedCategory === category ? "*" : ">"}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="relative overflow-hidden rounded-[42px] border border-white/30 bg-[linear-gradient(135deg,#131313_0%,#271b13_48%,#3b2317_100%)] p-8 text-[#fffaf4] shadow-[0_36px_90px_rgba(30,18,8,0.28)] sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,199,139,0.28),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(219,108,75,0.24),transparent_22%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_100%)]" />
            <div className="relative max-w-2xl">
              <p className="text-sm uppercase tracking-[0.45em] text-[#f0c78b]">
                {HERO_SLIDES[activeSlide].eyebrow}
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.02]">
                {HERO_SLIDES[activeSlide].title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#e6ddd2] sm:text-lg">
                {HERO_SLIDES[activeSlide].body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                  Production-minded structure
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                  Refined visual language
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                  Admin and storefront in one app
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.eyebrow}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      activeSlide === index ? "w-10 bg-white" : "w-2.5 bg-white/40"
                    }`}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.96)_0%,rgba(245,235,224,0.92)_100%)] p-6 shadow-[0_18px_50px_rgba(62,41,17,0.1)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6e4a]">Products Live</p>
              <p className="mt-3 text-5xl font-bold text-[#151515]">{pagination.totalItems}</p>
              <p className="mt-3 text-sm leading-6 text-[#6e675f]">
                Actively merchandised items available in the catalog.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-700">Categories</p>
              <p className="mt-3 text-5xl font-bold text-slate-950">
                {Math.max(categories.length - 1, 0)}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Organized sections that make the storefront easier to browse.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#fff7ef_0%,#f7efe4_100%)] p-6 shadow-[0_18px_50px_rgba(62,41,17,0.1)] sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6e4a]">Presentation Value</p>
              <p className="mt-3 text-lg font-semibold text-[#151515]">
                Strong enough for a recruiter demo, while still simple enough to extend later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_TILES.map((tile) => (
            <div
              key={tile.title}
              className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_16px_36px_rgba(62,41,17,0.08)]"
            >
              <p className="text-sm font-semibold text-[#151515]">{tile.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#6e675f]">{tile.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[34px] border border-[#f68b1e] bg-[linear-gradient(90deg,#f68b1e_0%,#ffad4d_100%)] shadow-[0_22px_60px_rgba(246,139,30,0.22)]">
          <div className="flex flex-col gap-6 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/80">Flash Sale</p>
              <h2 className="mt-3 text-3xl font-bold">Today&apos;s top marketplace picks</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                Inspired by major commerce marketplaces: high-visibility deals, urgency-driven sections, and quick-access product browsing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {MARKETPLACE_HIGHLIGHTS.map((item) => (
                <span key={item} className="rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-white/60 bg-[rgba(255,250,244,0.82)] p-5 shadow-[0_18px_50px_rgba(62,41,17,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8b6e4a]">
                Storefront
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#151515]">
                Shop the current collection
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                placeholder="Search products"
                className="rounded-full border border-[#d8c7b1] bg-white px-5 py-3 text-sm shadow-sm outline-none transition focus:border-[#c9862a] focus:ring-2 focus:ring-[#f0c78b]/40"
              />

              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setPage(1);
                }}
                className="rounded-full border border-[#d8c7b1] bg-white px-5 py-3 text-sm shadow-sm outline-none transition focus:border-[#c9862a] focus:ring-2 focus:ring-[#f0c78b]/40"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <p className="text-[#6e675f]">Loading products...</p>}
        {error && <p className="text-rose-600">{error}</p>}

        {!loading && !error && (
          <>
            {featuredProducts.length > 0 ? (
              <div className="mb-10">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8b6e4a]">
                      Featured Offers
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#151515]">
                      Handpicked picks for high conversion
                    </h3>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={`featured-${product.id}`}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {products.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-[#cdbca7] bg-[rgba(255,250,244,0.92)] p-10 text-center text-[#6e675f]">
                No products matched your search.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />

            {spotlightProducts.length > 0 ? (
              <div className="mt-12 rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbf6ef_100%)] p-6 shadow-[0_20px_50px_rgba(62,41,17,0.08)]">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8b6e4a]">
                      Official Store Style
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#151515]">
                      More products shoppers can discover fast
                    </h3>
                  </div>
                  <p className="text-sm text-[#6e675f]">
                    Designed to mimic the density and discoverability of a large marketplace.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {spotlightProducts.map((product) => (
                    <ProductCard
                      key={`spotlight-${product.id}`}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

export default StorefrontPage;
