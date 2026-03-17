"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Campaign } from "@/lib/types";

interface CampaignWithCount extends Campaign {
  _count: { registrations: number };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CampaignTab() {
  const [campaigns, setCampaigns] = useState<CampaignWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    flowType: "feria" as "jugar" | "feria",
    expiresAt: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [qrData, setQrData] = useState<{ url: string; campaignName: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) setCampaigns(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  function resetForm() {
    setEditingId(null);
    setFormData({ name: "", slug: "", flowType: "feria", expiresAt: "" });
    setAutoSlug(true);
    setShowForm(false);
  }

  async function handleSave() {
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/campaigns/${editingId}` : "/api/campaigns";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        slug: formData.slug,
        flowType: formData.flowType,
        expiresAt: formData.expiresAt,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!editingId && data.signedUrl) {
        setQrData({ url: data.signedUrl, campaignName: formData.name });
      }
      await fetchCampaigns();
      resetForm();
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchCampaigns();
  }

  async function handleShowQR(campaign: CampaignWithCount) {
    const res = await fetch(`/api/campaigns/${campaign.id}/signed-url`);
    if (res.ok) {
      const data = await res.json();
      setQrData({ url: data.signedUrl, campaignName: campaign.name });
    }
  }

  async function handleCopyUrl() {
    if (!qrData) return;
    await navigator.clipboard.writeText(qrData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadQR() {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, 1024, 1024);
      ctx!.drawImage(img, 0, 0, 1024, 1024);
      const a = document.createElement("a");
      a.download = `qr-${qrData?.campaignName || "campaign"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  function startEdit(c: CampaignWithCount) {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      slug: c.slug,
      flowType: c.flowType,
      expiresAt: c.expiresAt.split("T")[0],
    });
    setAutoSlug(false);
    setShowForm(true);
  }

  return (
    <>
      {/* QR Modal */}
      {qrData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{qrData.campaignName}</h3>
            <p className="text-xs text-gray-500 mb-4 break-all">{qrData.url}</p>

            <div ref={qrRef} className="flex justify-center mb-4">
              <QRCodeSVG
                value={qrData.url}
                size={256}
                level="H"
                includeMargin
                fgColor="#1a1a1a"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyUrl}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? "Copiado!" : "Copiar URL"}
              </button>
              <button
                onClick={handleDownloadQR}
                className="flex-1 bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Descargar QR
              </button>
            </div>
            <button
              onClick={() => setQrData(null)}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-orange-brand">{campaigns.length}</p>
          <p className="text-xs text-gray-500">Campañas</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva campaña
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border-2 border-orange-brand p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {editingId ? "Editar campaña" : "Nueva campaña"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: autoSlug ? slugify(name) : formData.slug,
                  });
                }}
                placeholder="Ej: Expo Dental 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                placeholder="expo-dental-2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de flujo</label>
              <select
                value={formData.flowType}
                onChange={(e) =>
                  setFormData({ ...formData, flowType: e.target.value as "jugar" | "feria" })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="feria">Feria (registro + juego)</option>
                <option value="jugar">Jugar (directo al juego)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha de vencimiento</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.slug || !formData.expiresAt}
              className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {editingId ? "Guardar cambios" : "Crear campaña"}
            </button>
            <button
              onClick={resetForm}
              className="text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Campaign list */}
      {loading ? (
        <p className="text-center text-gray-400 py-8">Cargando...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No hay campañas creadas</p>
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => {
            const isExpired = new Date(c.expiresAt) < new Date();
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${
                        !c.active
                          ? "bg-gray-100 text-gray-500"
                          : isExpired
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {!c.active ? "Inactiva" : isExpired ? "Expirada" : "Activa"}
                    </span>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${
                        c.flowType === "feria"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {c.flowType === "feria" ? "Feria" : "Jugar"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        <span className="font-mono">/c/{c.slug}</span>
                        {" · "}
                        Vence: {new Date(c.expiresAt).toLocaleDateString("es-AR")}
                        {" · "}
                        {c._count.registrations} registros
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleShowQR(c)}
                      className="text-xs text-gray-400 hover:text-orange-brand p-1.5 rounded hover:bg-orange-50 transition-colors"
                      title="Ver QR"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => startEdit(c)}
                      className="text-xs text-gray-400 hover:text-orange-brand p-1.5 rounded hover:bg-orange-50 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleActive(c.id, c.active)}
                      className={`text-xs p-1.5 rounded transition-colors ${
                        c.active
                          ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                          : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                      title={c.active ? "Desactivar" : "Activar"}
                    >
                      {c.active ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
