"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Download, Power, CheckCircle, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";

export default function Home() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleStopServer = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/stop-server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to stop server");
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-3xl p-8 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Server className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Ledezma's ATM10 Server
              </h1>
              <p className="text-neutral-400 text-sm flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Azure Server Control Panel
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Packwiz Sync Card */}
            <motion.a 
              href="/api/packwiz-sync"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-5 bg-neutral-800/40 hover:bg-neutral-800/60 transition-colors border border-neutral-700/50 rounded-2xl cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200">Download Modpack</h3>
                  <p className="text-xs text-neutral-400 mt-1">Get the latest Packwiz sync file</p>
                </div>
              </div>
            </motion.a>

            {/* Server Control Section */}
            <div className="p-6 bg-red-950/10 border border-red-900/30 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert className="w-24 h-24 text-red-500" />
              </div>

              <div>
                <h3 className="font-semibold text-red-400 flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  Deallocate Azure VM
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Turns off the server instance completely to save computing credits.
                </p>
              </div>

              <div className="space-y-3 relative z-10">
                <input 
                  type="password"
                  placeholder="Enter Administrator PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder:text-neutral-600 disabled:opacity-50"
                />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStopServer}
                  disabled={!pin || status === "loading" || status === "success"}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Power className="w-5 h-5" />
                  )}
                  {status === "loading" ? "Deallocating VM..." : status === "success" ? "Deallocated" : "Shutdown Server"}
                </motion.button>
              </div>

              {/* Status Messages */}
              {status === "error" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-950/50 p-3 rounded-lg border border-red-900/50">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </motion.div>
              )}
              {status === "success" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-950/50 p-3 rounded-lg border border-emerald-900/50">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Server VM has been triggered to deallocate successfully.
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
