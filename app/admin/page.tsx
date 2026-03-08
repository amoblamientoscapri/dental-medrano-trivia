"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Question, GameConfig, Registration } from "@/lib/types";

type Tab = "preguntas" | "registros";

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
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("preguntas");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [qRes, cRes] = await Promise.all([
        fetch("/api/questions"),
        fetch("/api/config"),
      ]);
      if (qRes.ok) setQuestions(await qRes.json());
      if (cRes.ok) setConfig(await cRes.json());
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (tab === "registros") fetchRegistrations();
  }, [tab, fetchRegistrations]);

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

  function handleDownloadCSV() {
    const BOM = "\uFEFF";
    const headers = ["Nombre", "Teléfono", "Email", "Edad", "Estudiante", "Especialidad", "Resultado", "Fecha"];
    const rows = registrations.map((r) => [
      r.nombre,
      r.telefono,
      r.correo,
      String(r.edad),
      r.esEstudiante ? "Sí" : "No",
      r.especialidad || "-",
      r.gameResult === "won" ? "Ganó" : r.gameResult === "lost" ? "Perdió" : "Sin jugar",
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
              onClick={() => setConfigOpen(!configOpen)}
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
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-orange-brand">
                    {registrations.length}
                  </p>
                  <p className="text-xs text-gray-500">Registros</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {registrations.filter((r) => r.gameResult === "won").length}
                  </p>
                  <p className="text-xs text-gray-500">Ganaron</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {registrations.filter((r) => r.gameResult === "lost").length}
                  </p>
                  <p className="text-xs text-gray-500">Perdieron</p>
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
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Resultado</th>
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
      </div>
    </div>
  );
}
