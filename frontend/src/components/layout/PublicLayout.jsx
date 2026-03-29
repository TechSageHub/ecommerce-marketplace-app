import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDelivery } from "../../context/DeliveryContext";
import { useWishlist } from "../../context/WishlistContext";

function PublicLayout() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { deliveryZone, setDeliveryZone } = useDelivery();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("search") || "");
  }, [location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    navigate(`/${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const navLinks = (orientation = "row") => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${orientation === "column" ? "block" : "inline-flex items-center"} rounded-full px-4 py-2 transition ${
            isActive
              ? "bg-white text-[#151515] shadow-sm"
              : "hover:bg-white/70 hover:text-[#151515]"
          }`
        }
      >
        Storefront
      </NavLink>
      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `rounded-full px-4 py-2 transition ${
            isActive
              ? "bg-white text-[#151515] shadow-sm"
              : "hover:bg-white/70 hover:text-[#151515]"
          }`
        }
      >
        Cart ({cartCount})
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `rounded-full px-4 py-2 transition ${
            isActive
              ? "bg-white text-[#151515] shadow-sm"
              : "text-[#54463a] hover:bg-white/70 hover:text-[#151515]"
          }`
        }
      >
        Account
      </NavLink>
      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `rounded-full px-4 py-2 transition ${
            isActive
              ? "bg-white text-[#151515] shadow-sm"
              : "text-[#54463a] hover:bg-white/70 hover:text-[#151515]"
          }`
        }
      >
        Wishlist ({wishlistCount})
      </NavLink>
      <Link
        to="/admin/login"
        className="rounded-full bg-[#151515] px-5 py-2.5 text-[#fffaf4] transition hover:bg-[#2f2a26]"
      >
        Admin
      </Link>
    </>
  );

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(201,134,42,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(219,108,75,0.15),transparent_24%)]" />
      <div className="border-b border-black/5 bg-[#1f1f1f] text-[#fffaf4]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] sm:px-6 lg:px-8">
          <span>Marketplace inspired shopping experience</span>
          <div className="hidden items-center gap-6 sm:flex">
            <span>Sell on NovaCart</span>
            <span>Pay on Delivery</span>
            <label className="flex items-center gap-2">
              <span>{deliveryZone} Delivery</span>
              <select
                value={deliveryZone}
                onChange={(event) => setDeliveryZone(event.target.value)}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.15em] text-white outline-none"
              >
                <option className="text-slate-900" value="Lagos">Lagos</option>
                <option className="text-slate-900" value="Abuja">Abuja</option>
                <option className="text-slate-900" value="Other">Other</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fffaf4]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-[1.35rem] font-bold tracking-tight text-[#151515]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,#151515_0%,#3c2418_100%)] text-sm text-[#fffaf4] shadow-[0_12px_24px_rgba(21,21,21,0.18)]">
              N
            </span>
            <span className="flex flex-col leading-none">
              <span>NovaCart</span>
              <span className="text-[0.55rem] font-medium uppercase tracking-[0.45em] text-[#8b6e4a]">
                Commerce House
              </span>
            </span>
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 px-6 lg:block"
          >
            <div className="flex items-center gap-3 rounded-full border border-[#eadcc8] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(62,41,17,0.08)]">
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search products, brands and categories"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#54463a] outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f68b1e] px-5 py-2 text-sm font-medium text-white"
              >
                Search
              </button>
            </div>
          </form>

          <nav className="hidden items-center gap-3 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-medium text-[#6e675f] shadow-[0_10px_30px_rgba(62,41,17,0.08)] sm:flex">
            {navLinks()}
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-full border border-[#d8c7b1] bg-white px-4 py-2 text-sm font-medium text-[#151515] shadow-sm sm:hidden"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-black/5 bg-[#fffaf4]/95 px-4 pb-4 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="mx-auto max-w-7xl pt-4">
              <div className="flex items-center gap-3 rounded-full border border-[#eadcc8] bg-white px-3 py-2 shadow-sm">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent px-3 py-2 text-sm text-[#54463a] outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#f68b1e] px-4 py-2 text-sm font-medium text-white"
                >
                  Go
                </button>
              </div>
            </form>
            <nav className="mx-auto flex max-w-7xl flex-col gap-3 pt-4 text-sm font-medium text-[#6e675f]">
              {navLinks("column")}
            </nav>
          </div>
        ) : null}
      </header>

      <Outlet />

      <footer className="border-t border-black/5 bg-[#1f1f1f] text-[#f4ede3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.38em] text-[#f0c78b]">
              NovaCart
            </p>
            <p className="mt-4 text-sm leading-7 text-[#d9d0c6]">
              A marketplace-style commerce project built to feel polished in interviews and structured enough to keep extending.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Need Help?</p>
            <div className="mt-4 space-y-3 text-sm text-[#d9d0c6]">
              <p>Chat with us</p>
              <p>Track an order</p>
              <p>Return policy</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">About</p>
            <div className="mt-4 space-y-3 text-sm text-[#d9d0c6]">
              <p>Company information</p>
              <p>Careers</p>
              <p>Terms and privacy</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Make Money With Us</p>
            <div className="mt-4 space-y-3 text-sm text-[#d9d0c6]">
              <p>Sell on NovaCart</p>
              <p>Become a delivery partner</p>
              <p>Advertise your products</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
