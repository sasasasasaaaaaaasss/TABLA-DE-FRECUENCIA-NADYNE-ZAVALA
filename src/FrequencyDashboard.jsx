import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./FrequencyDashboard.css";

/* ============================================================
   1. DATOS BASE (extraidos de TABLA_DE_FRECUENCIA.csv)
   ============================================================ */
const RAW_DATA = [
  { aula: "2B", nombre: "NICOLAS TALLEDO CENTURION", r: ["NO", "SI", "NO", "SI", "NO", "NO"] },
  { aula: "2B", nombre: "ANGIE CASTILLO MORE", r: ["SI", "SI", "NO", "SI", "SI", "NO"] },
  { aula: "2B", nombre: "EDSAUD FLORES", r: ["NO", "SI", "SI", "SI", "SI", "SI"] },
  { aula: "2B", nombre: "PAZOS", r: ["NO", "SI", "NO", "SI", "NO", "NO"] },
  { aula: "2B", nombre: "INNA COVENAS MORALES", r: ["SI", "SI", "NO", "SI", "SI", "NO"] },
  { aula: "2A", nombre: "VANNIA SERROZA", r: ["NO", "SI", "SI", "SI", "SI", "NO"] },
  { aula: "2A", nombre: "ANGEL PARIHUACHE MARTINEZ", r: ["NO", "SI", "NO", "SI", "SI", "NO"] },
  { aula: "2A", nombre: "YURYXA SAYURI CARHUALLOCLLA FLORES", r: ["NO", "NO", "SI", "SI", "SI", "NO"] },
  { aula: "2A", nombre: "THAYRA SOCOLA CHORREZ", r: ["NO", "NO", "SI", "SI", "SI", "SI"] },
  { aula: "2A", nombre: "RAYZA SOCOLA CRUZ", r: ["SI", "SI", "SI", "SI", "NO", "SI"] },
  { aula: "2C", nombre: "EMILY CORNEJO RIOS", r: ["NO", "SI", "NO", "SI", "SI", "SI"] },
  { aula: "2C", nombre: "MIA FALLA", r: ["NO", "SI", "NO", "SI", "NO", "NO"] },
  { aula: "2C", nombre: "CAROLINA CRUZ CURAY", r: ["NO", "SI", "NO", "SI", "SI", "NO"] },
  { aula: "2C", nombre: "REYNERD VEGA", r: ["SI", "SI", "SI", "SI", "SI", "SI"] },
  { aula: "2C", nombre: "ALEXIS PAOLO GUEVARA RETO", r: ["NO", "SI", "NO", "SI", "SI", "SI"] },
  { aula: "2D", nombre: "KEREM AQUINO PAIVA", r: ["NO", "SI", "NO", "SI", "SI", "NO"] },
  { aula: "2D", nombre: "LUANA GARCIA", r: ["NO", "SI", "NO", "SI", "SI", "SI"] },
  { aula: "2D", nombre: "ANGEL STICK ALVARADO ROQUE", r: ["NO", "NO", "SI", "SI", "SI", "SI"] },
  { aula: "2D", nombre: "JULIMAR CALEB", r: ["NO", "NO", "NO", "SI", "SI", "NO"] },
  { aula: "2D", nombre: "JOSE JAHAZIEL JUAREZ QUEREVALU", r: ["SI", "NO", "NO", "SI", "SI", "NO"] },
];

const PREGUNTAS = [
  { corto: "Ambiente escolar", texto: "¿Crees qué el ambiente escolar está en un buen estado?" },
  { corto: "Cuidado del ambiente", texto: "¿Crees que mejorar o cuidar el espacio de nuestra escuela contribuye al cuidado del medio ambiente?" },
  { corto: "Salón limpio", texto: "¿Consideras que tu salón de clases se mantiene limpio durante la jornada escolar?" },
  { corto: "Frutas y verduras", texto: "¿Crees que consumir frutas y verduras diariamente te ayuda a mantener una vida más saludable y sana?" },
  { corto: "Peso adecuado", texto: "¿Consideras que tu peso es adecuado para tu edad y estatura?" },
  { corto: "Actividad física", texto: "¿Realizas al menos 30 minutos de actividad física al día?" },
];

const AULAS = ["2A", "2B", "2C", "2D"];

const AULA_COLOR = {
  "2A": "#E8A33D",
  "2B": "#4F9C8C",
  "2C": "#8C5383",
  "2D": "#3E6B93",
};

const SI_COLOR = "#7FB08B";
const NO_COLOR = "#C1584A";

const pct = (n) => `${(n * 100).toFixed(0)}%`;
const dec = (n) => n.toFixed(2);

/* ============================================================
   2. COMPONENTE
   ============================================================ */
export default function FrequencyDashboard() {
  const [selectedAulas, setSelectedAulas] = useState([...AULAS]);
  const [selectedPreguntas, setSelectedPreguntas] = useState(PREGUNTAS.map((_, idx) => idx));

  const toggleAula = (aula) => {
    setSelectedAulas((prev) => {
      if (prev.includes(aula)) {
        if (prev.length === 1) return prev;
        return prev.filter((a) => a !== aula);
      }
      return [...prev, aula];
    });
  };

  const togglePregunta = (idx) => {
    setSelectedPreguntas((prev) => {
      if (prev.includes(idx)) {
        if (prev.length === 1) return prev;
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx].sort((a, b) => a - b);
    });
  };

  const filtered = useMemo(
    () => RAW_DATA.filter((s) => selectedAulas.includes(s.aula)),
    [selectedAulas]
  );

  /* Tabla de frecuencia: agrupa las respuestas de TODAS las preguntas
     seleccionadas (cada respuesta de cada alumno cuenta como una observacion) */
  const freqTable = useMemo(() => {
    const total = filtered.length * selectedPreguntas.length || 1;
    let fiSi = 0;
    filtered.forEach((s) => {
      selectedPreguntas.forEach((idx) => {
        if (s.r[idx] === "SI") fiSi += 1;
      });
    });
    const fiNo = total - fiSi;
    const hiSi = fiSi / total;
    const hiNo = fiNo / total;
    return [
      { respuesta: "SI", fi: fiSi, Fi: fiSi, hi: hiSi, Hi: hiSi },
      { respuesta: "NO", fi: fiNo, Fi: fiSi + fiNo, hi: hiNo, Hi: hiSi + hiNo },
    ];
  }, [filtered, selectedPreguntas]);

  const totalFiltrado = filtered.length;
  const totalObservaciones = filtered.length * selectedPreguntas.length;

  const kpis = useMemo(() => {
    return AULAS.filter((a) => selectedAulas.includes(a)).map((aula) => {
      const alumnos = RAW_DATA.filter((s) => s.aula === aula);
      const total = alumnos.length;
      const siSeleccionadas = alumnos.reduce(
        (acc, s) => acc + selectedPreguntas.filter((idx) => s.r[idx] === "SI").length,
        0
      );
      const indiceBienestar =
        alumnos.reduce((acc, s) => acc + s.r.filter((v) => v === "SI").length, 0) /
        (total * PREGUNTAS.length);
      return {
        aula,
        total,
        pctPregunta: total ? siSeleccionadas / (total * selectedPreguntas.length) : 0,
        indiceBienestar,
      };
    });
  }, [selectedAulas, selectedPreguntas]);

  const barData = freqTable.map((row) => ({ respuesta: row.respuesta, fi: row.fi }));

  const comparativa = useMemo(() => {
    return PREGUNTAS.filter((_, idx) => selectedPreguntas.includes(idx)).map((p) => {
      const idx = PREGUNTAS.indexOf(p);
      const row = { corto: p.corto };
      selectedAulas.forEach((aula) => {
        const alumnos = RAW_DATA.filter((s) => s.aula === aula);
        const si = alumnos.filter((s) => s.r[idx] === "SI").length;
        row[aula] = alumnos.length ? Math.round((si / alumnos.length) * 100) : 0;
      });
      return row;
    });
  }, [selectedAulas, selectedPreguntas]);

  const tituloPregunta =
    selectedPreguntas.length === PREGUNTAS.length
      ? "todas las preguntas"
      : selectedPreguntas.length === 1
      ? PREGUNTAS[selectedPreguntas[0]].corto
      : `${selectedPreguntas.length} preguntas seleccionadas`;

  return (
    <div className="fd-root">
      {/* ---------------- HERO ---------------- */}
      <header className="fd-header">
        <div className="fd-header-lines" />
        <div className="fd-header-inner">
          <p className="fd-eyebrow">Encuesta de bienestar escolar · 2do grado</p>
          <h1 className="fd-title">José Pardo y Barreda</h1>
          <p className="fd-subtitle">
            Tabla de frecuencia a partir de las respuestas de {RAW_DATA.length} estudiantes
            en las secciones 2A, 2B, 2C y 2D.
          </p>
          <div className="fd-stats">
            <div className="fd-stat">
              <div className="fd-stat-num">{RAW_DATA.length}</div>
              <div className="fd-stat-label">Estudiantes totales</div>
            </div>
            <div className="fd-stat">
              <div className="fd-stat-num">{totalFiltrado}</div>
              <div className="fd-stat-label">En la seleccion actual</div>
            </div>
            <div className="fd-stat">
              <div className="fd-stat-num">{PREGUNTAS.length}</div>
              <div className="fd-stat-label">Preguntas evaluadas</div>
            </div>
          </div>
        </div>
      </header>

      <main className="fd-main">
        {/* ---------------- TABS DE AULAS ---------------- */}
        <div className="fd-tabs">
          {AULAS.map((aula) => {
            const active = selectedAulas.includes(aula);
            return (
              <button
                key={aula}
                onClick={() => toggleAula(aula)}
                className={`fd-tab${active ? " fd-tab-active" : ""}`}
                style={{ borderTopColor: AULA_COLOR[aula] }}
              >
                Aula {aula}
              </button>
            );
          })}
          <div className="fd-tabs-spacer">
            <button className="fd-reset" onClick={() => setSelectedAulas([...AULAS])}>
              Ver todas
            </button>
          </div>
        </div>

        {/* ---------------- PANEL PRINCIPAL ---------------- */}
        <div className="fd-panel">
          {/* Selector de pregunta */}
          <div className="fd-question-block">
            <div className="fd-question-header">
              <p className="fd-section-label">Preguntas bajo analisis (elige una o varias)</p>
              <button
                className="fd-reset"
                onClick={() => setSelectedPreguntas(PREGUNTAS.map((_, idx) => idx))}
              >
                Seleccionar todas
              </button>
            </div>
            <div className="fd-question-pills">
              {PREGUNTAS.map((p, idx) => (
                <button
                  key={p.corto}
                  onClick={() => togglePregunta(idx)}
                  className={`fd-pill${selectedPreguntas.includes(idx) ? " fd-pill-active" : ""}`}
                >
                  {p.corto}
                </button>
              ))}
            </div>
            {selectedPreguntas.length === 1 && (
              <p className="fd-question-text">"{PREGUNTAS[selectedPreguntas[0]].texto}"</p>
            )}
          </div>

          {/* KPIs por aula */}
          <div className="fd-kpi-grid">
            {kpis.map((k) => (
              <div key={k.aula} className="fd-kpi-card" style={{ borderLeftColor: AULA_COLOR[k.aula] }}>
                <div className="fd-kpi-aula">Aula {k.aula}</div>
                <div className="fd-kpi-value">{pct(k.pctPregunta)}</div>
                <div className="fd-kpi-caption">
                  respondio SI en {selectedPreguntas.length === 1 ? "esta pregunta" : "las preguntas elegidas"}
                </div>
                <div className="fd-kpi-index">
                  Indice de bienestar: <b>{pct(k.indiceBienestar)}</b>
                </div>
                <div className="fd-kpi-total">{k.total} estudiantes</div>
              </div>
            ))}
          </div>

          {/* Tabla + Pie chart */}
          <div className="fd-content-grid">
            <div className="fd-table-wrap">
              <p className="fd-section-label">Tabla de frecuencia — {tituloPregunta}</p>
              {selectedPreguntas.length > 1 && (
                <p className="fd-question-text">
                  {totalFiltrado} estudiantes × {selectedPreguntas.length} preguntas = {totalObservaciones} respuestas
                  contabilizadas
                </p>
              )}
              <table className="fd-table">
                <thead>
                  <tr>
                    {["Respuesta (Xi)", "fi", "Fi", "hi", "Hi", "%hi·100", "%Hi·100"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {freqTable.map((row) => (
                    <tr key={row.respuesta}>
                      <td>
                        <span className={`fd-badge ${row.respuesta === "SI" ? "fd-badge-si" : "fd-badge-no"}`}>
                          {row.respuesta}
                        </span>
                      </td>
                      <td>{row.fi}</td>
                      <td>{row.Fi}</td>
                      <td>{dec(row.hi)}</td>
                      <td>{dec(row.Hi)}</td>
                      <td>{pct(row.hi)}</td>
                      <td>{pct(row.Hi)}</td>
                    </tr>
                  ))}
                  <tr className="fd-total-row">
                    <td>Total</td>
                    <td>{totalObservaciones}</td>
                    <td>{totalObservaciones}</td>
                    <td>1.00</td>
                    <td>1.00</td>
                    <td>100%</td>
                    <td>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="fd-chart-col">
              <p className="fd-section-label">Distribucion SI / NO</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={barData} dataKey="fi" nameKey="respuesta" innerRadius={45} outerRadius={80} paddingAngle={3}>
                    {barData.map((entry) => (
                      <Cell key={entry.respuesta} fill={entry.respuesta === "SI" ? SI_COLOR : NO_COLOR} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparativa */}
          <div className="fd-comparativa">
            <p className="fd-section-label">Comparativa de % SI por aula, todas las preguntas</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={comparativa} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                <XAxis dataKey="corto" angle={-20} textAnchor="end" interval={0} height={60} tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {selectedAulas.map((aula) => (
                  <Bar key={aula} dataKey={aula} name={`Aula ${aula}`} fill={AULA_COLOR[aula]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="fd-footer">
          Tabla de Nadyne Zavala · {selectedAulas.length} de {AULAS.length} aulas seleccionadas
        </p>
      </main>
    </div>
  );
}
