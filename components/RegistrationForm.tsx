"use client";

import { useState, useRef, type FormEvent } from "react";

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  loading: boolean;
}

export interface RegistrationData {
  nombre: string;
  telefono: string;
  correo: string;
  edad: number;
  esEstudiante: boolean;
  especialidad?: string;
}

export function RegistrationForm({ onSubmit, loading }: RegistrationFormProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [edad, setEdad] = useState("");
  const [esEstudiante, setEsEstudiante] = useState(false);
  const [especialidad, setEspecialidad] = useState("");

  const telefonoRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const edadRef = useRef<HTMLInputElement>(null);
  const especialidadRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre || !telefono || !correo || !edad) return;
    if (!esEstudiante && !especialidad) return;

    onSubmit({
      nombre,
      telefono,
      correo,
      edad: Number(edad),
      esEstudiante,
      especialidad: esEstudiante ? undefined : especialidad,
    });
  }

  function focusNext(ref: React.RefObject<HTMLInputElement | HTMLButtonElement | null>) {
    ref.current?.focus();
  }

  const inputBase =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base font-medium text-gray-800 bg-white focus:border-orange-brand focus:outline-none transition-colors placeholder:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Nombre y Apellido
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), focusNext(telefonoRef))}
            enterKeyHint="next"
            autoComplete="name"
            placeholder="Juan Pérez"
            className={inputBase}
            autoFocus
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Teléfono
          </label>
          <input
            ref={telefonoRef}
            type="tel"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), focusNext(correoRef))}
            enterKeyHint="next"
            inputMode="tel"
            autoComplete="tel"
            placeholder="11 1234-5678"
            className={inputBase}
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Correo electrónico
          </label>
          <input
            ref={correoRef}
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), focusNext(edadRef))}
            enterKeyHint="next"
            inputMode="email"
            autoComplete="email"
            placeholder="juan@email.com"
            className={inputBase}
          />
        </div>

        {/* Edad */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Edad
          </label>
          <input
            ref={edadRef}
            type="number"
            required
            min={1}
            max={120}
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!esEstudiante && especialidadRef.current) {
                  focusNext(especialidadRef);
                } else {
                  focusNext(submitRef);
                }
              }
            }}
            enterKeyHint={esEstudiante ? "go" : "next"}
            inputMode="numeric"
            placeholder="30"
            className={inputBase}
          />
        </div>

        {/* Toggle Estudiante */}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="button"
            role="switch"
            aria-checked={esEstudiante}
            onClick={() => {
              setEsEstudiante(!esEstudiante);
              if (esEstudiante) {
                // Turning off student → show specialty
                setTimeout(() => especialidadRef.current?.focus(), 100);
              }
            }}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
              esEstudiante ? "bg-orange-brand" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                esEstudiante ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span className="text-base font-medium text-gray-700">
            Soy estudiante
          </span>
        </div>

        {/* Especialidad (solo si NO es estudiante) */}
        {!esEstudiante && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Especialidad
            </label>
            <input
              ref={especialidadRef}
              type="text"
              required={!esEstudiante}
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  focusNext(submitRef);
                }
              }}
              enterKeyHint="go"
              placeholder="Ej: Ortodoncia, Endodoncia, Odontología general..."
              className={inputBase}
            />
          </div>
        )}
      </div>

      <button
        ref={submitRef}
        type="submit"
        disabled={loading || !nombre || !telefono || !correo || !edad || (!esEstudiante && !especialidad)}
        className="mt-5 w-full bg-orange-brand hover:bg-orange-dark text-white font-extrabold text-2xl py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <span className="inline-block w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-7 h-7 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            ¡JUGAR!
          </>
        )}
      </button>
    </form>
  );
}
