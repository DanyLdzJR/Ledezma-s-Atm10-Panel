"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Download, Power, CheckCircle, AlertTriangle, Loader2, ShieldAlert, Monitor, Terminal, BookOpen, ChevronRight, Apple, Cpu, Zap, Settings, RefreshCw, Play } from "lucide-react";

export default function Home() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [osTab, setOsTab] = useState<"windows" | "linux" | "mac">("windows");
  
  // New state for VM tracking
  const [vmState, setVmState] = useState<"checking" | "running" | "deallocated" | "starting" | "deallocating" | "unknown" | "error">("checking");

  const checkVmStatus = async (silent = false) => {
    if (!silent) setVmState("checking");
    try {
      const res = await fetch("/api/server-status", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setVmState(data.state as any);
        // If it was transitioning and now it's done, we can clear the action status
        if ((data.state === "running" && status === "success") || (data.state === "deallocated" && status === "success")) {
          // Keep success message for a bit, maybe? We let the user see it.
        }
      } else {
        setVmState("error");
      }
    } catch (err) {
      setVmState("error");
    }
  };

  useEffect(() => {
    checkVmStatus();
    const interval = setInterval(() => checkVmStatus(true), 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const handleToggleServer = async () => {
    if (vmState !== "running" && vmState !== "deallocated") return; // Prevent action if transitioning
    
    setStatus("loading");
    setErrorMessage("");
    try {
      const endpoint = vmState === "running" ? "/api/stop-server" : "/api/start-server";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to toggle server");
      
      setStatus("success");
      setVmState(vmState === "running" ? "deallocating" : "starting");
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
      "Opcional: Si Prism Launcher marca error en Modrinth/CurseForge Mods, descárgalos directo a tu carpeta Descargas.",
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

  const isServerOn = vmState === "running";
  const isTransitioning = vmState === "starting" || vmState === "deallocating" || vmState === "checking";
  const statusColor = vmState === "running" ? "text-emerald-400" : vmState === "deallocated" ? "text-red-400" : vmState === "checking" ? "text-neutral-400" : "text-yellow-400";
  const statusBg = vmState === "running" ? "bg-emerald-500" : vmState === "deallocated" ? "bg-red-500" : vmState === "checking" ? "bg-neutral-500" : "bg-yellow-500";
  
  const StatusDot = () => (
    <span className="relative flex h-3 w-3">
      {isServerOn && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${statusBg}`}></span>
    </span>
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center p-6 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full mix-blend-screen transition-colors duration-1000 ${isServerOn ? 'bg-emerald-600/10' : 'bg-indigo-600/10'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full mix-blend-screen transition-colors duration-1000 ${isServerOn ? 'bg-cyan-600/10' : 'bg-purple-600/10'}`} />
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
            <div className={`p-3 rounded-2xl border shadow-inner transition-colors ${isServerOn ? 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/20'}`}>
              <Server className={`w-8 h-8 transition-colors ${isServerOn ? 'text-emerald-400' : 'text-indigo-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-300% animate-gradient">
                  Ledezma's ATM10
                </h1>
                <div className="flex items-center gap-2 bg-neutral-950/50 px-3 py-1.5 rounded-full border border-neutral-800">
                  <StatusDot />
                  <span className={`text-xs font-medium uppercase tracking-wider ${statusColor}`}>
                    {vmState === "checking" ? "Verificando..." : vmState}
                  </span>
                </div>
              </div>
              <p className="text-neutral-400 text-sm flex items-center gap-2 mt-1">
                Azure Server Control Panel
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Server Control Section (Moved up for better UX) */}
            <div className={`p-6 rounded-2xl space-y-4 relative overflow-hidden group transition-colors border ${isServerOn ? 'bg-gradient-to-br from-emerald-950/20 to-neutral-950/40 border-emerald-900/30' : 'bg-gradient-to-br from-red-950/20 to-neutral-950/40 border-red-900/30'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {isServerOn ? <Server className="w-32 h-32 text-emerald-500" /> : <ShieldAlert className="w-32 h-32 text-red-500" />}
              </div>

              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold flex items-center gap-2 ${isServerOn ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isServerOn ? <CheckCircle className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                    1. Encendido y Apagado (Azure VM)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[85%]">
                    {isServerOn ? "El servidor está encendido y consumiendo créditos. Apágalo cuando termines." : "El servidor está apagado para ahorrar créditos de Azure. Enciéndelo para jugar."}
                  </p>
                </div>
                <button onClick={() => checkVmStatus()} className="p-2 bg-neutral-950/50 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors border border-neutral-800">
                  <RefreshCw className={`w-4 h-4 ${vmState === "checking" ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="space-y-3 relative z-10 pt-2">
                <input 
                  type="password"
                  placeholder="Introduce el PIN de Administrador"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={status === "loading" || isTransitioning}
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-neutral-600 disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && pin && status !== "loading" && !isTransitioning && handleToggleServer()}
                />
                
                <motion.button
                  whileHover={!pin || status === "loading" || isTransitioning ? {} : { scale: 1.01 }}
                  whileTap={!pin || status === "loading" || isTransitioning ? {} : { scale: 0.98 }}
                  onClick={handleToggleServer}
                  disabled={!pin || status === "loading" || isTransitioning}
                  className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border ${
                    isServerOn 
                    ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-900/20 border-red-500/50 hover:border-red-400" 
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-900/20 border-emerald-500/50 hover:border-emerald-400"
                  }`}
                >
                  {status === "loading" || isTransitioning ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isServerOn ? (
                    <Power className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  {status === "loading" ? "Procesando en Azure..." : isTransitioning ? `Azure: ${vmState}...` : isServerOn ? "Apagar Servidor Completamente" : "Encender Servidor"}
                </motion.button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-950/50 p-3 rounded-xl border border-red-900/50 relative z-10 mt-3">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`flex items-center gap-2 text-xs p-3 rounded-xl border relative z-10 mt-3 ${isServerOn ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900/50' : 'text-emerald-400 bg-emerald-950/50 border-emerald-900/50'}`}>
                    <CheckCircle className="w-4 h-4 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.5)] rounded-full" />
                    ¡Comando enviado a Microsoft Azure! La máquina virtual está cambiando de estado (tardará entre 1 a 3 minutos).
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                  <h3 className="font-semibold text-neutral-200">2. Descargar Modpack (Packwiz)</h3>
                  <p className="text-xs text-neutral-400 mt-1">Obtén el archivo necesario para sincronizar tus mods.</p>
                </div>
              </div>
            </motion.a>

            {/* Installation Instructions */}
            <div className="p-6 bg-neutral-950/40 border border-neutral-800 rounded-2xl space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-neutral-200">3. Guía de Conexión al Servidor</h3>
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

            {/* Performance Recommendations */}
            <div className="p-6 bg-indigo-950/10 border border-indigo-900/30 rounded-2xl space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-neutral-200">4. Recomendaciones de Rendimiento (Prism Launcher)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-neutral-300">Ajustes de Memoria (Java)</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-neutral-400">
                    <li><strong className="text-neutral-300">Min. (Xms):</strong> 1024 MiB</li>
                    <li><strong className="text-neutral-300">Max. (Xmx):</strong> 8192 MiB ó 9216 MiB</li>
                    <li className="mt-2 text-indigo-300/80 italic">Ideal para tu equipo Fedora o PCs con 16GB RAM: Asignar 8GB a 9GB garantiza que dejes suficiente RAM libre para el OS sin ahogar el modpack.</li>
                  </ul>
                </div>

                <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-semibold text-neutral-300">Argumentos de Java (Aikar's Flags)</h4>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">Pega esto en la caja "Argumentos de Java" (Configuración {'>'} Java):</p>
                  <code className="block w-full bg-neutral-950 p-2 rounded-lg text-[10px] text-emerald-300/70 overflow-x-auto whitespace-nowrap border border-neutral-800 scrollbar-thin scrollbar-thumb-neutral-800 select-all">
                    -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1
                  </code>
                </div>
              </div>
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
