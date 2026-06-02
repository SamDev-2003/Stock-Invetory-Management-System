import { useState } from "react";
import { getDailyStockOut, getDailyStockStatus } from "../api/simsReportApi";

function ReportsPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusRows, setStatusRows] = useState([]);
  const [outRows, setOutRows] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const run = async () => {
    setMessage("");
    if (!date) {
      setFieldErrors({ date: "Please select a date to generate the report." });
      return;
    }
    setFieldErrors({});
    setIsLoading(true);
    try {
      const [a, b] = await Promise.all([getDailyStockStatus(date), getDailyStockOut(date)]);
      setStatusRows(a.data);
      setOutRows(b.data);
      if (!a.data.length && !b.data.length) {
        setMessage("No stock data found for the selected date.");
      }
    } catch {
      setMessage("Report failed. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-emerald-200 font-medium block mb-2">
              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Report Date
            </label>
            <input
              type="date"
              className={`w-full rounded-lg border px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${fieldErrors.date ? "border-red-500" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setFieldErrors({});
              }}
            />
            {fieldErrors.date && (
              <p className="mt-1 text-xs text-red-300 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.date}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl px-6 py-2.5 hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            onClick={run}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </>
            )}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            message.includes("No stock") 
              ? "bg-blue-500/20 border border-blue-400/50 text-blue-100"
              : message.includes("failed")
              ? "bg-red-500/20 border border-red-400/50 text-red-100"
              : "bg-yellow-500/20 border border-yellow-400/50 text-yellow-100"
          }`}>
            <div className="flex items-center gap-2">
              {message.includes("No stock") ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
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
      </div>

      {/* Daily Stock Status Section */}
      <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Daily Stock Status</h2>
          <p className="text-emerald-100 text-sm">Spare name, stored quantity, stock in/out, and remaining stock</p>
        </div>
        
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-white/20 backdrop-blur-sm">
              <tr>
                <th className="p-3 text-left text-white font-semibold">Spare Name</th>
                <th className="p-3 text-left text-white font-semibold">Category</th>
                <th className="p-3 text-right text-white font-semibold">Stored Qty (Current)</th>
                <th className="p-3 text-right text-white font-semibold">Stock In (Day)</th>
                <th className="p-3 text-right text-white font-semibold">Stock Out (Day)</th>
                <th className="p-3 text-right text-white font-semibold bg-emerald-500/20 rounded-r-lg">Remaining (Current)</th>
              </tr>
            </thead>
            <tbody>
              {statusRows.map((r, idx) => (
                <tr key={r.spareName + r.category + idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-emerald-100 font-medium">{r.spareName}</td>
                  <td className="p-3 text-white/80">{r.category}</td>
                  <td className="p-3 text-right text-white/80">{r.storedQuantity}</td>
                  <td className="p-3 text-right text-emerald-300">+{r.stockInQuantity}</td>
                  <td className="p-3 text-right text-orange-300">-{r.stockOutQuantity}</td>
                  <td className="p-3 text-right text-white font-semibold">{r.remainingQuantity}</td>
                </tr>
              ))}
              {statusRows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-white/50">
                    No stock status data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Daily Stock Out Report Section */}
      <section className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Daily Stock Out Report</h2>
          <p className="text-orange-100 text-sm">Detailed list of all stock-out transactions for the selected date</p>
        </div>
        
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-white/20 backdrop-blur-sm">
              <tr>
                <th className="p-3 text-left text-white font-semibold">Spare Part</th>
                <th className="p-3 text-right text-white font-semibold">Qty Out</th>
                <th className="p-3 text-right text-white font-semibold">Unit Price ($)</th>
                <th className="p-3 text-right text-white font-semibold">Total ($)</th>
                <th className="p-3 text-left text-white font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {outRows.map((r) => (
                <tr key={r.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-emerald-100 font-medium">{r.spareName}</td>
                  <td className="p-3 text-right text-white/80">{r.stockOutQuantity}</td>
                  <td className="p-3 text-right text-white/80">${r.stockOutUnitPrice}</td>
                  <td className="p-3 text-right text-orange-300 font-semibold">${r.stockOutTotalPrice}</td>
                  <td className="p-3 text-white/60">
                    {r.stockOutDate ? new Date(r.stockOutDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : "N/A"}
                  </td>
                </tr>
              ))}
              {outRows.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-white/50">
                    No stock-out records found for the selected date
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

export default ReportsPage;