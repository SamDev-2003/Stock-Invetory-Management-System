import { useEffect, useState } from "react";
import { getSpareParts } from "../api/sparePartsApi";
import { getStockOut, createStockOut, updateStockOut, deleteStockOut } from "../api/stockOutApi";

const empty = { sparePartId: "", stockOutQuantity: "", stockOutUnitPrice: "", stockOutDate: "" };

const validateStockOut = (form, editing) => {
  const errors = {};
  if (!editing && !form.sparePartId) errors.sparePartId = "Select a spare part.";
  if (!form.stockOutQuantity || Number(form.stockOutQuantity) <= 0) {
    errors.stockOutQuantity = "Quantity must be greater than 0.";
  }
  if (form.stockOutUnitPrice === "" || Number.isNaN(Number(form.stockOutUnitPrice)) || Number(form.stockOutUnitPrice) < 0) {
    errors.stockOutUnitPrice = "Unit price must be 0 or greater.";
  }
  if (!form.stockOutDate) errors.stockOutDate = "Stock-out date is required.";
  return errors;
};

function StockOutPage() {
  const [parts, setParts] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");

  const load = async () => {
    const [pr, out] = await Promise.all([getSpareParts(), getStockOut()]);
    setParts(pr.data);
    setRows(out.data);
  };

  useEffect(() => {
    load().catch(() => setMessage("Load failed"));
  }, []);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const inputClass = (key) =>
    `rounded-lg border px-3 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${fieldErrors[key] ? "border-red-500" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent w-full`;

  const selectClass = (key) =>
    `rounded-lg border px-3 py-2 bg-white/10 backdrop-blur-sm text-white ${fieldErrors[key] ? "border-red-500" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent w-full`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const errors = validateStockOut(form, editing);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    const q = Number(form.stockOutQuantity);
    const u = Number(form.stockOutUnitPrice);
    if (!editing) {
      try {
        await createStockOut({
          sparePartId: form.sparePartId,
          stockOutQuantity: q,
          stockOutUnitPrice: u,
          stockOutDate: new Date(form.stockOutDate).toISOString(),
        });
        setForm(empty);
        setFieldErrors({});
        setMessage("Saved");
        load();
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed");
      }
    } else {
      try {
        await updateStockOut(editing, {
          stockOutQuantity: q,
          stockOutUnitPrice: u,
          stockOutDate: new Date(form.stockOutDate).toISOString(),
        });
        setEditing(null);
        setForm(empty);
        setFieldErrors({});
        setMessage("Updated");
        load();
      } catch (err) {
        setMessage(err.response?.data?.message || "Update failed");
      }
    }
  };

  const startEdit = (r) => {
    setEditing(r._id);
    setFieldErrors({});
    setForm({
      sparePartId: r.sparePart?._id || r.sparePart,
      stockOutQuantity: r.stockOutQuantity,
      stockOutUnitPrice: r.stockOutUnitPrice,
      stockOutDate: r.stockOutDate
        ? new Date(r.stockOutDate).toISOString().slice(0, 10)
        : "",
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this stock out?")) return;
    setMessage("");
    try {
      await deleteStockOut(id);
      if (editing === id) {
        setEditing(null);
        setForm(empty);
        setFieldErrors({});
      }
      setMessage("Deleted");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m8-8v16m-4-4l4 4 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Stock Out Management</h2>
          <p className="text-amber-100 text-sm">Create, update, or delete stock-out records</p>
        </div>
        
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <select
              className={selectClass("sparePartId")}
              value={form.sparePartId}
              disabled={Boolean(editing)}
              onChange={(e) => setField("sparePartId", e.target.value)}
              style={{ color: form.sparePartId ? 'white' : 'rgba(255,255,255,0.5)' }}
            >
              <option value="" className="text-gray-900">Select Spare Part</option>
              {parts.map((p) => (
                <option key={p._id} value={p._id} className="text-gray-900">
                  {p.name} — {p.category}
                </option>
              ))}
            </select>
            {fieldErrors.sparePartId && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.sparePartId}
              </p>
            )}
          </div>
          
          <div>
            <input
              type="number"
              className={inputClass("stockOutQuantity")}
              min="1"
              placeholder="Quantity"
              value={form.stockOutQuantity}
              onChange={(e) => setField("stockOutQuantity", e.target.value)}
            />
            {fieldErrors.stockOutQuantity && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.stockOutQuantity}
              </p>
            )}
          </div>
          
          <div>
            <input
              type="number"
              className={inputClass("stockOutUnitPrice")}
              min="0"
              step="0.01"
              placeholder="Unit Price ($)"
              value={form.stockOutUnitPrice}
              onChange={(e) => setField("stockOutUnitPrice", e.target.value)}
            />
            {fieldErrors.stockOutUnitPrice && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.stockOutUnitPrice}
              </p>
            )}
          </div>
          
          <div>
            <input
              type="date"
              className={inputClass("stockOutDate")}
              value={form.stockOutDate}
              onChange={(e) => setField("stockOutDate", e.target.value)}
            />
            {fieldErrors.stockOutDate && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.stockOutDate}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl px-4 py-2 hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {editing ? "Update" : "Save"}
            </button>
            {editing && (
              <button
                type="button"
                className="bg-white/20 backdrop-blur-sm text-white rounded-xl px-4 py-2 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                  setFieldErrors({});
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        
        {message && (
          <div className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            message === "Saved" || message === "Updated" 
              ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-100" 
              : message === "Deleted"
              ? "bg-orange-500/20 border border-orange-400/50 text-orange-100"
              : "bg-red-500/20 border border-red-400/50 text-red-100"
          }`}>
            <div className="flex items-center gap-2">
              {message === "Saved" || message === "Updated" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : message === "Deleted" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
      </section>

      {/* Records Table Section */}
      <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Stock Out Records</h2>
          <p className="text-amber-100 text-sm">View and manage all transactions</p>
        </div>
        
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/20 backdrop-blur-sm">
              <tr>
                <th className="p-3 text-white font-semibold">Part</th>
                <th className="p-3 text-white font-semibold">Qty</th>
                <th className="p-3 text-white font-semibold">Unit $</th>
                <th className="p-3 text-white font-semibold">Total $</th>
                <th className="p-3 text-white font-semibold">Date</th>
                <th className="p-3 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-emerald-100 font-medium">{r.sparePart?.name || "N/A"}</td>
                  <td className="p-3 text-white/80">{r.stockOutQuantity}</td>
                  <td className="p-3 text-white/80">${r.stockOutUnitPrice}</td>
                  <td className="p-3 text-amber-300 font-semibold">${r.stockOutTotalPrice}</td>
                  <td className="p-3 text-white/60">
                    {r.stockOutDate ? new Date(r.stockOutDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "N/A"}
                   </td>
                  <td className="p-3">
                    <button
                      type="button"
                      className="mr-2 bg-amber-500/20 backdrop-blur-sm text-amber-200 px-3 py-1 rounded-lg text-xs font-medium hover:bg-amber-500/40 transition-all duration-200"
                      onClick={() => startEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500/20 backdrop-blur-sm text-red-200 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-500/40 transition-all duration-200"
                      onClick={() => onDelete(r._id)}
                    >
                      Delete
                    </button>
                   </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-white/50">
                    No stock-out records found
                  </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default StockOutPage;