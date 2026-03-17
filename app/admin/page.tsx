"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Question, GameConfig, Registration, Branch, CampaignConfig } from "@/lib/types";

type Tab = "preguntas" | "registros" | "sucursales";

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<GameConfig>({
    questionsPerRound: 3,
    winMessage: "",
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    options: ["", "", ""],
    correctIndex: 0,
  });
  const [configOpen, setConfigOpen] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaign, setCampaign] = useState<CampaignConfig>({
    name: "",
    slug: "",
    prizeDeadline: "",
    active: false,
  });
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("preguntas");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: "", address: "" });
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editBranchData, setEditBranchData] = useState({ name: "", address: "" });
  const [testEmail, setTestEmail] = useState("");
  const [testEmailStatus, setTestEmailStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [testEmailResult, setTestEmailResult] = useState("");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [qRes, cRes, campRes] = await Promise.all([
        fetch("/api/questions"),
        fetch("/api/config"),
        fetch("/api/campaign"),
      ]);
      if (qRes.ok) setQuestions(await qRes.json());
      if (cRes.ok) setConfig(await cRes.json());
      if (campRes.ok) setCampaign(await campRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setRegLoading(true);
    try {
      const res = await fetch("/api/registros");
      if (res.ok) setRegistrations(await res.json());
    } finally {
      setRegLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    setBranchLoading(true);
    try {
      const res = await fetch("/api/sucursales");
      if (res.ok) setBranches(await res.json());
    } finally {
      setBranchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (tab === "registros") fetchRegistrations();
    if (tab === "sucursales") fetchBranches();
  }, [tab, fetchRegistrations, fetchBranches]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleSaveQuestion() {
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/questions/${editingId}` : "/api/questions";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      await fetchData();
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta pregunta?")) return;
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  }

  async function handleSaveConfig() {
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) setConfigOpen(false);
  }

  async function handleClearRegistrations() {
    if (!confirm("¿Eliminar TODOS los registros? Esta acción no se puede deshacer.")) return;
    const res = await fetch("/api/registros", { method: "DELETE" });
    if (res.ok) {
      setRegistrations([]);
    }
  }

  async function handleResendEmail(code: string) {
    const res = await fetch(`/api/premios/${code}/resend-email`, { method: "POST" });
    if (res.ok) {
      alert("Email reenviado correctamente");
      fetchRegistrations();
    } else {
      alert("Error al reenviar email");
    }
  }

  // Branch handlers
  async function handleCreateBranch() {
    if (!newBranch.name || !newBranch.address) return;
    const res = await fetch("/api/sucursales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBranch),
    });
    if (res.ok) {
      setNewBranch({ name: "", address: "" });
      fetchBranches();
    }
  }

  async function handleUpdateBranch(id: string) {
    const res = await fetch(`/api/sucursales/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editBranchData),
    });
    if (res.ok) {
      setEditingBranchId(null);
      fetchBranches();
    }
  }

  async function handleToggleBranch(id: string, active: boolean) {
    await fetch(`/api/sucursales/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchBranches();
  }

  function handleDownloadCSV() {
    const BOM = "\uFEFF";
    const headers = [
      "Nombre", "Teléfono", "Email", "Edad", "Estudiante", "Especialidad",
      "Localidad", "Provincia", "Resultado", "Premio", "Estado Premio",
      "Sucursal Retiro", "Fecha Retiro", "Email Enviado", "Fecha"
    ];
    const rows = registrations.map((r) => [
      r.nombre,
      r.telefono,
      r.correo,
      String(r.edad),
      r.esEstudiante ? "Sí" : "No",
      r.especialidad || "-",
      r.localidad || "-",
      r.provincia || "-",
      r.gameResult === "won" ? "Ganó" : r.gameResult === "lost" ? "Perdió" : "Sin jugar",
      r.prize?.code || "-",
      r.prize ? (r.prize.status === "redeemed" ? "Retirado" : "Pendiente") : "-",
      r.prize?.branch?.name || "-",
      r.prize?.redeemedAt ? new Date(r.prize.redeemedAt).toLocaleString("es-AR") : "-",
      r.prize ? (r.prize.emailSent ? "Sí" : "No") : "-",
      new Date(r.timestamp).toLocaleString("es-AR"),
    ]);

    const csv = BOM + [headers, ...rows].map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registros-trivia-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSaveCampaign() {
    const res = await fetch("/api/campaign", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaign),
    });
    if (res.ok) {
      const saved = await res.json();
      setCampaign(saved);
      setQrDataUrl(null);
      setQrUrl(null);
    }
  }

  async function handleGenerateQr() {
    const res = await fetch("/api/campaign/generate-url", { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Error al generar QR");
      return;
    }
    const { url } = await res.json();
    setQrUrl(url);
    const QRCode = (await import("qrcode")).default;
    const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
    setQrDataUrl(dataUrl);
  }

  function handleDownloadQr() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${campaign.slug}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  function startEdit(q: Question) {
    setEditingId(q.id);
    setFormData({
      text: q.text,
      options: [...q.options],
      correctIndex: q.correctIndex,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setFormData({ text: "", options: ["", "", ""], correctIndex: 0 });
    setShowForm(false);
  }

  const filtered = questions.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const wonCount = registrations.filter((r) => r.gameResult === "won").length;
  const lostCount = registrations.filter((r) => r.gameResult === "lost").length;
  const prizeCount = registrations.filter((r) => r.prize).length;
  const redeemedCount = registrations.filter((r) => r.prize?.status === "redeemed").length;
  const pendingCount = prizeCount - redeemedCount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Admin Trivia
            </h1>
            <p className="text-xs text-gray-500">Dental Medrano</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCampaignOpen(!campaignOpen); if (!campaignOpen) setConfigOpen(false); }}
              className="text-sm text-gray-600 hover:text-orange-brand px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Campaña
            </button>
            <button
              onClick={() => { setConfigOpen(!configOpen); if (!configOpen) setCampaignOpen(false); }}
              className="text-sm text-gray-600 hover:text-orange-brand px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Configuracion
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Config panel */}
        {configOpen && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Configuracion del juego
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Preguntas por ronda
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={config.questionsPerRound}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      questionsPerRound: parseInt(e.target.value) || 3,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Mensaje al ganar
                </label>
                <input
                  type="text"
                  value={config.winMessage}
                  onChange={(e) =>
                    setConfig({ ...config, winMessage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSaveConfig}
              className="mt-3 bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Guardar configuracion
            </button>

            {/* Test Email */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Test Email (emBlue)</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Email para test..."
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={async () => {
                    if (!testEmail) return;
                    setTestEmailStatus("sending");
                    setTestEmailResult("");
                    try {
                      const res = await fetch("/api/test-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: testEmail, nombre: "Test User" }),
                      });
                      const data = await res.json();
                      if (data.ok) {
                        setTestEmailStatus("ok");
                        setTestEmailResult("Email enviado. Revisá la bandeja de entrada y los logs de Vercel.");
                      } else {
                        setTestEmailStatus("error");
                        setTestEmailResult(data.error || "Error al enviar. Revisá los logs de Vercel.");
                      }
                    } catch {
                      setTestEmailStatus("error");
                      setTestEmailResult("Error de conexión");
                    }
                  }}
                  disabled={!testEmail || testEmailStatus === "sending"}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {testEmailStatus === "sending" ? "Enviando..." : "Enviar test"}
                </button>
              </div>
              {testEmailResult && (
                <p className={`mt-2 text-sm ${testEmailStatus === "ok" ? "text-green-600" : "text-red-600"}`}>
                  {testEmailResult}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Campaign panel */}
        {campaignOpen && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Campaña con QR
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nombre de la campaña
                </label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) =>
                    setCampaign({ ...campaign, name: e.target.value })
                  }
                  placeholder="Ej: Expo Dental Marzo 2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={campaign.prizeDeadline}
                  onChange={(e) =>
                    setCampaign({ ...campaign, prizeDeadline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaign.active}
                  onChange={(e) =>
                    setCampaign({ ...campaign, active: e.target.checked })
                  }
                  className="rounded"
                />
                Campaña activa
              </label>
              {campaign.slug && (
                <span className="text-xs text-gray-400">
                  slug: {campaign.slug}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleSaveCampaign}
                disabled={!campaign.name || !campaign.prizeDeadline}
                className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Guardar campaña
              </button>
              <button
                onClick={handleGenerateQr}
                disabled={!campaign.slug || !campaign.active}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Generar QR
              </button>
            </div>

            {qrDataUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={qrDataUrl}
                    alt="QR de campaña"
                    className="w-48 h-48 rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">URL firmada:</p>
                    <p className="text-xs text-gray-700 break-all bg-white p-2 rounded border border-gray-200 mb-3">
                      {qrUrl}
                    </p>
                    <button
                      onClick={handleDownloadQr}
                      className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Descargar QR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("preguntas")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === "preguntas"
                ? "bg-white text-orange-brand shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Preguntas
          </button>
          <button
            onClick={() => setTab("registros")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === "registros"
                ? "bg-white text-orange-brand shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Registros
            {registrations.length > 0 && (
              <span className="ml-1.5 bg-orange-brand text-white text-xs px-1.5 py-0.5 rounded-full">
                {registrations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("sucursales")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === "sucursales"
                ? "bg-white text-orange-brand shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sucursales
          </button>
        </div>

        {/* ========== PREGUNTAS TAB ========== */}
        {tab === "preguntas" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-orange-brand">
                  {questions.length}
                </p>
                <p className="text-xs text-gray-500">Preguntas totales</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-orange-brand">
                  {config.questionsPerRound}
                </p>
                <p className="text-xs text-gray-500">Por ronda</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-orange-brand">
                  {questions.length > 0
                    ? Math.round(
                        (1 / Math.pow(3, config.questionsPerRound)) * 10000
                      ) / 100
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500">Prob. ganar al azar</p>
              </div>
            </div>

            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar preguntas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                + Nueva pregunta
              </button>
            </div>

            {/* Form modal */}
            {showForm && (
              <div className="bg-white rounded-xl border-2 border-orange-brand p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {editingId ? "Editar pregunta" : "Nueva pregunta"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Pregunta
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  {formData.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, correctIndex: i })
                        }
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          formData.correctIndex === i
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title={
                          formData.correctIndex === i
                            ? "Respuesta correcta"
                            : "Marcar como correcta"
                        }
                      >
                        {String.fromCharCode(65 + i)}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[i] = e.target.value;
                          setFormData({ ...formData, options: newOpts });
                        }}
                        placeholder={`Opcion ${String.fromCharCode(65 + i)}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-400">
                    Hace click en la letra para marcar la respuesta correcta
                    (verde = correcta)
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveQuestion}
                    disabled={
                      !formData.text || formData.options.some((o) => !o.trim())
                    }
                    className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {editingId ? "Guardar cambios" : "Crear pregunta"}
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

            {/* Questions list */}
            <div className="space-y-2">
              {filtered.map((q, i) => (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        <span className="text-gray-400 mr-2">#{i + 1}</span>
                        {q.text}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt, j) => (
                          <span
                            key={j}
                            className={`inline-block text-xs px-2 py-1 rounded-full ${
                              j === q.correctIndex
                                ? "bg-green-100 text-green-700 font-semibold"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {String.fromCharCode(65 + j)}: {opt.length > 50 ? opt.slice(0, 50) + "..." : opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(q)}
                        className="text-xs text-gray-400 hover:text-orange-brand p-1.5 rounded hover:bg-orange-50 transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-xs text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                {search ? "No se encontraron preguntas" : "No hay preguntas cargadas"}
              </p>
            )}
          </>
        )}

        {/* ========== REGISTROS TAB ========== */}
        {tab === "registros" && (
          <>
            {/* Stats + Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-orange-brand">
                    {registrations.length}
                  </p>
                  <p className="text-xs text-gray-500">Registros</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {wonCount}
                  </p>
                  <p className="text-xs text-gray-500">Ganaron</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {lostCount}
                  </p>
                  <p className="text-xs text-gray-500">Perdieron</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {prizeCount}
                  </p>
                  <p className="text-xs text-gray-500">Premios</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {redeemedCount}
                  </p>
                  <p className="text-xs text-gray-500">Retirados</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                  <p className="text-xs text-gray-500">Pendientes</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchRegistrations}
                  disabled={regLoading}
                  className="text-sm text-gray-600 hover:text-orange-brand px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors border border-gray-200"
                >
                  {regLoading ? "Cargando..." : "Actualizar"}
                </button>
                <button
                  onClick={handleDownloadCSV}
                  disabled={registrations.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Descargar CSV
                </button>
                <button
                  onClick={handleClearRegistrations}
                  disabled={registrations.length === 0}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Limpiar todo
                </button>
              </div>
            </div>

            {/* Registrations table */}
            {registrations.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No hay registros todavía
              </p>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Teléfono</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Edad</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Estudiante</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Especialidad</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Localidad</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Resultado</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Premio</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Sucursal</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registrations.map((r, i) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{r.nombre}</td>
                          <td className="px-4 py-3 text-gray-600">{r.telefono}</td>
                          <td className="px-4 py-3 text-gray-600">{r.correo}</td>
                          <td className="px-4 py-3 text-gray-600">{r.edad}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                              r.esEstudiante
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {r.esEstudiante ? "Sí" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{r.especialidad || "-"}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {r.localidad ? (
                              <span>{r.localidad}{r.provincia ? `, ${r.provincia}` : ""}</span>
                            ) : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {r.gameResult === "won" ? (
                              <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                                Ganó
                              </span>
                            ) : r.gameResult === "lost" ? (
                              <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                                Perdió
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-orange-brand font-bold">
                            {r.prize?.code || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {r.prize ? (
                              r.prize.status === "redeemed" ? (
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                  Retirado
                                </span>
                              ) : (
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                                  Pendiente
                                </span>
                              )
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {r.prize?.branch?.name || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {r.prize ? (
                              r.prize.emailSent ? (
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <button
                                  onClick={() => handleResendEmail(r.prize!.code)}
                                  className="text-xs text-red-500 hover:text-red-700 underline"
                                  title="Reenviar email"
                                >
                                  Reenviar
                                </button>
                              )
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(r.timestamp).toLocaleString("es-AR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== SUCURSALES TAB ========== */}
        {tab === "sucursales" && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Nueva sucursal</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCreateBranch}
                  disabled={!newBranch.name || !newBranch.address}
                  className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  + Agregar
                </button>
              </div>
            </div>

            {branchLoading ? (
              <p className="text-center text-gray-400 py-8">Cargando...</p>
            ) : branches.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No hay sucursales</p>
            ) : (
              <div className="space-y-2">
                {branches.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    {editingBranchId === b.id ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={editBranchData.name}
                          onChange={(e) => setEditBranchData({ ...editBranchData, name: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          value={editBranchData.address}
                          onChange={(e) => setEditBranchData({ ...editBranchData, address: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBranch(b.id)}
                            className="bg-orange-brand hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingBranchId(null)}
                            className="text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${
                            b.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {b.active ? "Activa" : "Inactiva"}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">{b.name}</p>
                            <p className="text-sm text-gray-500 truncate">{b.address}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingBranchId(b.id);
                              setEditBranchData({ name: b.name, address: b.address });
                            }}
                            className="text-xs text-gray-400 hover:text-orange-brand p-1.5 rounded hover:bg-orange-50 transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleBranch(b.id, b.active)}
                            className={`text-xs p-1.5 rounded transition-colors ${
                              b.active
                                ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                            title={b.active ? "Desactivar" : "Activar"}
                          >
                            {b.active ? (
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
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
