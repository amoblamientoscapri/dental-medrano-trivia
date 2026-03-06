"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Question, GameConfig } from "@/lib/types";

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      </div>
    </div>
  );
}
