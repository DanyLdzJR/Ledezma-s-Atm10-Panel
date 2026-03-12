"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Download, Power, CheckCircle, AlertTriangle, Loader2, ShieldAlert, Monitor, Terminal, BookOpen, ChevronRight, Apple } from "lucide-react";

export default function Home() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [osTab, setOsTab] = useState<"windows" | "linux" | "mac">("windows");

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

  const currentInstructions = {
    windows: [
      "Descarga e instala Prism Launcher desde prismlauncher.org",
      "Abre Prism Launcher y vincula tu cuenta oficial de Microsoft/Minecraft.",
      "Da clic en 'Añadir Instancia' y ve a la pestaña 'Importar'.",
      "Pega nuestro link del Modpack que descargaste arriba o selecciona el archivo .zip.",
      "Da doble clic a la instancia creada para descargar los 481 mods automáticamente.",
      "Entra al juego, ve a Multijugador y conéctate a: 20.124.16.48"
    ],
    linux: [
      "Instala Prism Launcher vía Flatpak: flatpak install flathub org.prismlauncher.PrismLauncher",
      "Vincula tu cuenta oficial de Minecraft en los ajustes.",
      "Da clic en 'Añadir Instancia' -> pestaña 'Importar'.",
      "Pega el enlace de descarga del Modpack proporcionado arriba.",
      "Opcional: Si Prism Launcher marca error en CurseForge Mods, descárgalos directo a tu carpeta Descargas.",
      "Abre el juego y conéctate a la IP: 20.124.16.48"
    ],
    mac: [
      "Instala Prism Launcher usando Homebrew: brew install --cask prismlauncher",
      "Inicia sesión con tu cuenta de Microsoft/Minecraft.",
      "Haz clic en 'Añadir Instancia' -> 'Importar'.",
      "Usa el link de descarga directa de nuestro pack o sube el .zip.",
      "Opcional: Asegúrate de tener instalado Java 21 en tu Mac si el juego no abre.",
      "Abre Minecraft y únete al servidor en: 20.124.16.48"
    ]
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center p-6 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl mt-8"
      >
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-3xl p-8 mb-8">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner shadow-indigo-500/20">
              <Server className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-300% animate-gradient">
                Ledezma's ATM10 Server
              </h1>
              <p className="text-neutral-400 text-sm flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
                Azure Server Control Panel
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Packwiz Sync Card */}
            <motion.a 
              href="/api/packwiz-sync"
              whileHover={{ scale: 1.01, backgroundColor: "rgba(38, 38, 38, 0.8)" }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center justify-between p-5 bg-neutral-800/40 border border-neutral-700/50 rounded-2xl cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200">1. Descargar Modpack (Packwiz)</h3>
                  <p className="text-xs text-neutral-400 mt-1">Obtén el archivo necesario para sincronizar tus mods.</p>
                </div>
              </div>
            </motion.a>

            {/* Installation Instructions */}
            <div className="p-6 bg-neutral-950/40 border border-neutral-800 rounded-2xl space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-neutral-200">2. Guía de Conexión al Servidor</h3>
              </div>

              {/* OS Tabs */}
              <div className="flex p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
                <button 
                  onClick={() => setOsTab("windows")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${osTab === "windows" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  <Monitor className="w-4 h-4" /> Windows
                </button>
                <button 
                  onClick={() => setOsTab("linux")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${osTab === "linux" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  <Terminal className="w-4 h-4" /> Linux
                </button>
                <button 
                  onClick={() => setOsTab("mac")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${osTab === "mac" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  <Apple className="w-4 h-4" /> MacOS
                </button>
              </div>

              {/* Instructions List */}
              <div className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-800/80 min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.ul 
                    key={osTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {currentInstructions[osTab].map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5 border border-indigo-500/30">
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>

            {/* Server Control Section */}
            <div className="p-6 bg-gradient-to-br from-red-950/20 to-neutral-950/40 border border-red-900/30 rounded-2xl space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-32 h-32 text-red-500" />
              </div>

              <div className="relative z-10">
                <h3 className="font-semibold text-red-400 flex items-center gap-2">
                  <Power className="w-5 h-5" />
                  3. Apagado de Azure VM
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-[85%]">
                  Apaga el servidor y detén la máquina virtual en Microsoft Azure para evitar consumir los créditos gratuitos mientras nadie está jugando.
                </p>
              </div>

              <div className="space-y-3 relative z-10 pt-2">
                <input 
                  type="password"
                  placeholder="Introduce el PIN de Administrador"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder:text-neutral-600 disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && pin && status !== "loading" && handleStopServer()}
                />
                
                <motion.button
                  whileHover={!pin || status === "loading" || status === "success" ? {} : { scale: 1.01 }}
                  whileTap={!pin || status === "loading" || status === "success" ? {} : { scale: 0.98 }}
                  onClick={handleStopServer}
                  disabled={!pin || status === "loading" || status === "success"}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/50 hover:border-red-400"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Power className="w-5 h-5" />
                  )}
                  {status === "loading" ? "Desconectando Máquina..." : status === "success" ? "Servidor Apagado Asegurado" : "Apagar Servidor Completamente"}
                </motion.button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-950/50 p-3 rounded-xl border border-red-900/50 relative z-10 overflow-hidden mt-3">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-950/50 p-3 rounded-xl border border-emerald-900/50 relative z-10 overflow-hidden mt-3">
                    <CheckCircle className="w-4 h-4 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.5)] rounded-full" />
                    ¡Éxito! La máquina virtual en Azure se está apagando correctamene. Tomará unos segundos en reflejarse.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-neutral-600 pb-10">
          Desarrollado con ❤️ para jugar All The Mods 10
        </p>
      </motion.div>
    </main>
  );
}
