import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../services/productService";
import formatCurrency from "../utils/formatCurrency";
import getImageUrl from "../utils/getImageUrl";

const initialState = {
  name: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

function ProductFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showError, showLoading, updateToast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const product = await getProductById(id);
        setFormData({
          name: product.name,
          price: String(product.price),
          category: product.category,
          image: product.image,
          stock: String(product.stock),
        });
      } catch (err) {
        setError(err.message);
        showError(err.message, "Could not load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, mode]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const toastId = showLoading(
      mode === "edit"
        ? "Saving your product changes."
        : "Creating your new product.",
      mode === "edit" ? "Updating product" : "Creating product"
    );

    try {
      setSaving(true);
      setError("");

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", String(Number(formData.price)));
      payload.append("category", formData.category);
      payload.append("stock", String(Number(formData.stock)));

      if (selectedFile) {
        payload.append("image", selectedFile);
      } else {
        payload.append("image", formData.image);
      }

      if (mode === "edit") {
        await updateProduct(id, payload, token);
      } else {
        await createProduct(payload, token);
      }

      updateToast(toastId, {
        type: "success",
        title: mode === "edit" ? "Product updated" : "Product created",
        message:
          mode === "edit"
            ? "Your product changes have been saved."
            : "The product has been added to the catalog.",
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
      updateToast(toastId, {
        type: "error",
        title: "Save failed",
        message: err.message,
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-700">
            Product Form
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            {mode === "edit" ? "Edit product" : "Add a new product"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create polished catalog entries with pricing, stock, category, and visual assets.
          </p>
        </div>
        <Link
          to="/admin/products"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-3xl bg-rose-100 px-5 py-4 text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-slate-500">Loading product...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:text-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Upload an image file. If you leave this empty while editing, the
                  current image will be kept.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Visual Preview
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">
                {formData.name || "Your product card"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This helps you review the product image and overall presentation before saving.
              </p>

              {(formData.image || previewUrl) ? (
                <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                  <img
                    src={previewUrl || getImageUrl(formData.image)}
                    alt={formData.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                      {formData.category || "Category"}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-slate-950">
                        {formData.name || "Untitled product"}
                      </p>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-sm text-white">
                        {formatCurrency(formData.price || 0)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      Stock: {formData.stock || 0}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  Upload an image to preview the product card.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 rounded-full bg-slate-950 px-6 py-3 font-medium text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:bg-slate-700 disabled:bg-slate-300"
          >
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Update product"
                : "Create product"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ProductFormPage;
