"use client";

import { useState, useEffect, use } from "react";
import type { Branch } from "@/lib/types";

interface PrizeInfo {
  code: string;
  status: "pending" | "redeemed";
  ganador: string;
  redeemedAt: string | null;
  branch: { name: string; address: string } | null;
}

export default function PremioPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [prize, setPrize] = useState<PrizeInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [prizeRes, branchesRes] = await Promise.all([
          fetch(`/api/premios/${code}`),
          fetch("/api/sucursales"),
        ]);

        if (!prizeRes.ok) {
          setError("Código inválido");
          return;
        }

        const prizeData = await prizeRes.json();
        setPrize(prizeData);

        if (branchesRes.ok) {
          setBranches(await branchesRes.json());
        }
      } catch {
        setError("Error al cargar");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  async function handleRedeem() {
    if (!selectedBranch) return;
    setRedeeming(true);

    try {
      const res = await fetch(`/api/premios/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId: selectedBranch }),
      });

      if (res.ok) {
        setRedeemed(true);
      } else {
        const data = await res.json();
        setError(data.error || "Error al retirar premio");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setRedeeming(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50">
        <p className="text-gray-400">Cargando...</p>
      </main>
    );
  }

  if (error && !prize) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Código inválido</h1>
          <p className="text-gray-500">Este código de premio no existe.</p>
        </div>
      </main>
    );
  }

  if (!prize) return null;

  // Already redeemed (loaded as redeemed)
  if (prize.status === "redeemed" && !redeemed) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Premio ya retirado</h1>
          <p className="text-gray-500 mb-1">
            Este premio ya fue retirado
            {prize.branch ? ` en ${prize.branch.name}` : ""}
          </p>
          {prize.redeemedAt && (
            <p className="text-sm text-gray-400">
              {new Date(prize.redeemedAt).toLocaleString("es-AR")}
            </p>
          )}
        </div>
      </main>
    );
  }

  // Just redeemed
  if (redeemed) {
    const branch = branches.find((b) => b.id === selectedBranch);
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-green-50 via-white to-green-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">¡Premio entregado!</h1>
          <p className="text-gray-600">
            Premio <span className="font-mono font-bold">{code}</span> entregado a <strong>{prize.ganador}</strong>
            {branch ? ` en ${branch.name}` : ""}.
          </p>
        </div>
      </main>
    );
  }

  // Pending - show redeem flow
  return (
    <main className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <div className="text-center mb-4">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-orange-brand/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-orange-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Entrega de premio</h1>
            <p className="text-gray-500 text-sm mt-1">
              Ganador: <strong>{prize.ganador}</strong>
            </p>
            <p className="font-mono text-2xl font-bold text-orange-brand mt-2 tracking-widest">
              {code}
            </p>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-orange-brand hover:bg-orange-dark text-white font-bold py-3 rounded-xl text-lg transition-all cursor-pointer active:scale-[0.97]"
            >
              Entregar premio
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Seleccioná la sucursal:</p>
              <div className="space-y-2">
                {branches.filter(b => b.active).map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      selectedBranch === b.id
                        ? "border-orange-brand bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="branch"
                      value={b.id}
                      checked={selectedBranch === b.id}
                      onChange={() => setSelectedBranch(b.id)}
                      className="accent-orange-brand"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{b.name}</p>
                      <p className="text-sm text-gray-500">{b.address}</p>
                    </div>
                  </label>
                ))}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowConfirm(false); setSelectedBranch(""); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={!selectedBranch || redeeming}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redeeming ? "Procesando..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
