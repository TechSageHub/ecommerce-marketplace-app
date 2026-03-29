import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import ProductTable from "../components/admin/ProductTable";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { deleteProduct, getProducts } from "../services/productService";

function AdminProductsPage() {
  const { token } = useAuth();
  const { showError, showLoading, updateToast } = useToast();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts({
        search: searchTerm,
        page,
        limit: 8,
      });
      setProducts(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      showError(err.message, "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchTerm]);

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm("Delete this product?");

    if (!shouldDelete) {
      return;
    }

    const toastId = showLoading(
      "Removing the product from your catalog.",
      "Deleting product"
    );

    try {
      await deleteProduct(productId, token);
      await loadProducts();
      updateToast(toastId, {
        type: "success",
        title: "Product deleted",
        message: "The product was removed successfully.",
      });
    } catch (err) {
      setError(err.message);
      updateToast(toastId, {
        type: "error",
        title: "Delete failed",
        message: err.message,
        duration: 4000,
      });
    }
  };

  return (
    <div>
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_100%)] p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-700">
              Catalog
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Manage products
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review, search, and maintain your catalog from a cleaner admin workspace.
            </p>
          </div>
          <Link
            to="/admin/products/new"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_16px_32px_rgba(15,23,42,0.16)] transition hover:bg-slate-700"
          >
            Add new product
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Search by product name"
            className="w-full max-w-sm rounded-full border border-slate-300 bg-white px-5 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
          <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
            {pagination.totalItems} products found
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-3xl bg-rose-100 px-5 py-4 text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-slate-500">Loading products...</p>
        ) : (
          <>
            <ProductTable products={products} onDelete={handleDelete} />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;
