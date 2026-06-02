import { useEffect, useState } from "react";
import { getSpareParts, createSparePart } from "../api/sparePartsApi";

const initial = { name: "", category: "", quantity: "", unitPrice: "" };

const validateSparePart = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.category.trim()) errors.category = "Category is required.";
  if (form.quantity === "" || Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
    errors.quantity = "Quantity must be 0 or greater.";
  }
  if (form.unitPrice === "" || Number.isNaN(Number(form.unitPrice)) || Number(form.unitPrice) < 0) {
    errors.unitPrice = "Unit price must be 0 or greater.";
  }
  return errors;
};

function SparePartPage() {
  const [form, setForm] = useState(initial);
  const [rows, setRows] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");

  const load = () =>
    getSpareParts()
      .then((r) => setRows(r.data))
      .catch(() => setMessage("Failed to load parts"));

  useEffect(() => {
    load();
  }, []);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const inputClass = (key) =>
    `w-full rounded border px-3 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${fieldErrors[key] ? "border-red-500" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const errors = validateSparePart(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    try {
      await createSparePart({
        name: form.name.trim(),
        category: form.category.trim(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
      setForm(initial);
      setFieldErrors({});
      setMessage("Saved");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      {/* Animated Gradient Background - Matching LoginPage */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 animate-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Decorative Blobs - Matching LoginPage */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 grid gap-6 md:grid-cols-2">
        {/* Insert Form Section */}
        <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Add Spare Part</h2>
            <p className="text-emerald-100 text-sm">Create new inventory item</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <input
                name="name"
                className={inputClass("name")}
                placeholder="Part Name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.name}
                </p>
              )}
            </div>
            
            <div>
              <input
                name="category"
                className={inputClass("category")}
                placeholder="Category"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              />
              {fieldErrors.category && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.category}
                </p>
              )}
            </div>
            
            <div>
              <input
                type="number"
                name="quantity"
                className={inputClass("quantity")}
                placeholder="Quantity"
                min="0"
                value={form.quantity}
                onChange={(e) => setField("quantity", e.target.value)}
              />
              {fieldErrors.quantity && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.quantity}
                </p>
              )}
            </div>
            
            <div>
              <input
                type="number"
                name="unitPrice"
                className={inputClass("unitPrice")}
                placeholder="Unit Price ($)"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => setField("unitPrice", e.target.value)}
              />
              {fieldErrors.unitPrice && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.unitPrice}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="relative w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Part
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 rounded-lg px-4 py-2 text-sm ${message === "Saved" ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-100" : "bg-red-500/20 border border-red-400/50 text-red-100"}`}>
              <div className="flex items-center gap-2">
                {message === "Saved" ? (
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

        {/* Parts List Section */}
        <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Inventory List</h2>
            <p className="text-emerald-100 text-sm">View all spare parts</p>
          </div>
          
          <div className="max-h-96 overflow-auto rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white/20 backdrop-blur-sm">
                <tr>
                  <th className="p-3 text-white font-semibold">Name</th>
                  <th className="p-3 text-white font-semibold">Category</th>
                  <th className="p-3 text-white font-semibold">Qty</th>
                  <th className="p-3 text-white font-semibold">Unit ($)</th>
                  <th className="p-3 text-white font-semibold">Total ($)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, index) => (
                  <tr key={p._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-emerald-100">{p.name}</td>
                    <td className="p-3 text-white/80">{p.category}</td>
                    <td className="p-3 text-white/80">{p.quantity}</td>
                    <td className="p-3 text-white/80">${p.unitPrice}</td>
                    <td className="p-3 text-emerald-300 font-semibold">${p.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="text-center py-8 text-white/50">
                No spare parts found. Add your first part!
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default SparePartPage;