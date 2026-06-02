import { useEffect, useState } from "react";
import { getSpareParts } from "../api/sparePartsApi";
import { getStockIn, createStockIn } from "../api/stockInApi";

const validateStockIn = (form) => {
  const errors = {};
  if (!form.sparePartId) errors.sparePartId = "Select a spare part.";
  if (!form.stockInQuantity || Number(form.stockInQuantity) <= 0) {
    errors.stockInQuantity = "Quantity must be greater than 0.";
  }
  if (!form.stockInDate) errors.stockInDate = "Stock-in date is required.";
  return errors;
};

function StockInPage() {
  const [parts, setParts] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ sparePartId: "", stockInQuantity: "", stockInDate: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");

  const load = async () => {
    const [pr, inRows] = await Promise.all([getSpareParts(), getStockIn()]);
    setParts(pr.data);
    setRows(inRows.data);
  };

  useEffect(() => {
    load().catch(() => setMessage("Load failed"));
  }, []);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const inputClass = (key) =>
    `w-full rounded-lg border px-3 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${fieldErrors[key] ? "border-red-500" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`;

  const selectClass = (key) =>
    `w-full rounded-lg border px-3 py-2 bg-white/10 backdrop-blur-sm text-white ${fieldErrors[key] ? "border-red-500" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const errors = validateStockIn(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    try {
      await createStockIn({
        sparePartId: form.sparePartId,
        stockInQuantity: Number(form.stockInQuantity),
        stockInDate: new Date(form.stockInDate).toISOString(),
      });
      setForm({ sparePartId: "", stockInQuantity: "", stockInDate: "" });
      setFieldErrors({});
      setMessage("Stock in saved");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Insert Form Section */}
      <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Stock In</h2>
          <p className="text-blue-100 text-sm">Add incoming stock to inventory</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <select
              className={selectClass("sparePartId")}
              value={form.sparePartId}
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
              className={inputClass("stockInQuantity")}
              placeholder="Quantity In"
              min="1"
              value={form.stockInQuantity}
              onChange={(e) => setField("stockInQuantity", e.target.value)}
            />
            {fieldErrors.stockInQuantity && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.stockInQuantity}
              </p>
            )}
          </div>
          
          <div>
            <input
              type="date"
              className={inputClass("stockInDate")}
              value={form.stockInDate}
              onChange={(e) => setField("stockInDate", e.target.value)}
            />
            {fieldErrors.stockInDate && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.stockInDate}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="relative w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-700 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Stock In
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            message === "Stock in saved" 
              ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-100" 
              : "bg-red-500/20 border border-red-400/50 text-red-100"
          }`}>
            <div className="flex items-center gap-2">
              {message === "Stock in saved" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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

      {/* History Section */}
      <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Transaction History</h2>
          <p className="text-blue-100 text-sm">Recent stock-in records</p>
        </div>
        
        <div className="max-h-96 overflow-auto rounded-lg">
          {rows.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No stock-in records found
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r._id} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="font-medium text-white">
                          {r.sparePart?.name || "Unknown Part"}
                        </span>
                        <span className="text-xs text-white/50">•</span>
                        <span className="text-xs text-blue-300">
                          {r.sparePart?.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-emerald-300 font-semibold">
                          +{r.stockInQuantity} units
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="text-white/60 text-xs">
                          {new Date(r.stockInDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StockInPage;