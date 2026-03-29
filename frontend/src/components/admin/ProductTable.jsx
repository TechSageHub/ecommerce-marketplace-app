import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";

function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        No products found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-[linear-gradient(90deg,#0f172a_0%,#13233b_100%)] text-left text-slate-300">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-slate-50/90">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                    {product.category}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-5 py-4 text-slate-600">{product.stock}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-700"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="rounded-full bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
