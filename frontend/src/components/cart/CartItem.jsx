import formatCurrency from "../../utils/formatCurrency";

function CartItem({ item, onChangeQuantity, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-20 rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
          <p className="text-sm text-slate-500">{item.category}</p>
          <p className="mt-2 font-medium text-slate-900">{formatCurrency(item.price)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1"
          max={item.stock}
          value={item.quantity}
          onChange={(event) =>
            onChangeQuantity(item.id, Number(event.target.value))
          }
          className="w-20 rounded-2xl border border-slate-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
