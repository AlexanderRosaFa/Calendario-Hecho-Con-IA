import { useState, useEffect } from "react";

// ── Design tokens ──────────────────────────────────────────────
const T = {
  navy:      "#1B2B4B",
  navyMid:   "#263854",
  ink:       "#0D1B2A",
  chalk:     "#F7F4EE",
  parchment: "#EDE8DC",
  amber:     "#F5A623",
  amberSoft: "#FDE9B8",
  mint:      "#4DB89E",
  mintSoft:  "#C7EDDE",
  coral:     "#F26D5B",
  coralSoft: "#FDDCD8",
  lavender:  "#9B8FD4",
  lavSoft:   "#E8E4F7",
  slate:     "#6B7A8D",
  white:     "#FFFFFF",
};

// ── Data ──────────────────────────────────────────────────────
const SUBJECTS = [
  { id: 1, name: "Matemáticas", color: T.amber,    soft: T.amberSoft, icon: "📐", teacher: "Prof. García", topics: ["Fracciones", "Álgebra básica", "Geometría", "Estadística"],        progress: 65 },
  { id: 2, name: "Ciencias",    color: T.mint,     soft: T.mintSoft,  icon: "🔬", teacher: "Prof. Ramos",  topics: ["Células", "Ecosistemas", "Energía", "Física básica"],               progress: 48 },
  { id: 3, name: "Lengua",      color: T.lavender, soft: T.lavSoft,   icon: "📖", teacher: "Prof. Luna",   topics: ["Gramática", "Redacción", "Literatura", "Ortografía"],               progress: 80 },
  { id: 4, name: "Historia",    color: T.coral,    soft: T.coralSoft, icon: "🏛️", teacher: "Prof. Vega",   topics: ["Prehistoria", "Antigüedad", "Edad Media", "Modernidad"],            progress: 35 },
];

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const SCHEDULE = {
  0: [
    { time: "08:00", duration: 90, subjectId: 1, room: "Aula 3A" },
    { time: "10:00", duration: 60, subjectId: 2, room: "Lab Bio" },
    { time: "15:00", duration: 60, type: "play", label: "Tiempo libre 🎮", color: T.coral, soft: T.coralSoft },
  ],
  1: [
    { time: "09:00", duration: 90, subjectId: 3, room: "Aula 3A" },
    { time: "11:00", duration: 60, subjectId: 4, room: "Aula 2B" },
    { time: "16:00", duration: 90, type: "play", label: "Deporte 🏃", color: T.coral, soft: T.coralSoft },
  ],
  2: [
    { time: "08:00", duration: 60, subjectId: 1, room: "Aula 3A" },
    { time: "09:30", duration: 60, subjectId: 2, room: "Lab Bio" },
    { time: "14:00", duration: 120, type: "play", label: "Tarde libre 🎨", color: T.coral, soft: T.coralSoft },
  ],
  3: [
    { time: "08:00", duration: 90, subjectId: 3, room: "Aula 3A" },
    { time: "10:00", duration: 90, subjectId: 4, room: "Aula 2B" },
    { time: "15:30", duration: 60, type: "play", label: "Juego libre 🎯", color: T.coral, soft: T.coralSoft },
  ],
  4: [
    { time: "09:00", duration: 60, subjectId: 1, room: "Aula 3A" },
    { time: "10:30", duration: 60, subjectId: 2, room: "Lab Bio" },
    { time: "12:00", duration: 60, subjectId: 3, room: "Aula 3A" },
    { time: "16:00", duration: 120, type: "play", label: "Fin de semana 🏖️", color: T.coral, soft: T.coralSoft },
  ],
};

const INITIAL_GOALS = [
  { id: 1, text: "Aprobar examen de fracciones",      subjectId: 1,    done: false, due: "Jun 15" },
  { id: 2, text: "Entregar proyecto de ecosistemas",  subjectId: 2,    done: false, due: "Jun 20" },
  { id: 3, text: "Redactar ensayo final",             subjectId: 3,    done: false, due: "Jun 25" },
  { id: 4, text: "Exposición sobre la Edad Media",    subjectId: 4,    done: false, due: "Jul 02" },
  { id: 5, text: "Jugar 1h al aire libre cada día",   subjectId: null, done: false, due: "Diario" },
];

// ── Helpers ────────────────────────────────────────────────────
function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const DAY_START   = 8 * 60;
const DAY_END     = 18 * 60;
const PX_PER_MIN  = 1.9;
const mpx = (min) => min * PX_PER_MIN;

// ── Component ─────────────────────────────────────────────────
export default function App() {
  const today = new Date().getDay(); // 0=Sun…6=Sat → remap to Mon=0
  const todayIdx = today === 0 ? 6 : today - 1;

  const [activeDay, setActiveDay]           = useState(todayIdx < 5 ? todayIdx : 0);
  const [activeTab, setActiveTab]           = useState("semana");
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [goals, setGoals]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem("goals")) || INITIAL_GOALS; }
    catch { return INITIAL_GOALS; }
  });

  // Persist goals
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const dayEvents = SCHEDULE[activeDay] || [];
  const subjectOf = (id) => SUBJECTS.find((s) => s.id === id);

  function toggleGoal(id) {
    setGoals((g) => g.map((gl) => (gl.id === id ? { ...gl, done: !gl.done } : gl)));
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: T.chalk, minHeight: "100svh", color: T.ink }}>

      {/* Header */}
      <header style={{ background: T.navy, padding: "16px 20px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📅</div>
          <div>
            <div style={{ color: T.chalk, fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>Mi Calendario Escolar</div>
            <div style={{ color: T.slate, fontSize: 12 }}>
              {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })} · 3.° Grado
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[["semana","📆 Semana"],["materias","📚 Materias"],["objetivos","🎯 Objetivos"]].map(([k, label]) => (
            <button key={k} onClick={() => setActiveTab(k)} style={{
              flex: 1, padding: "9px 4px",
              borderRadius: "8px 8px 0 0",
              border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 12,
              background: activeTab === k ? T.chalk : "transparent",
              color:      activeTab === k ? T.navy  : "#8BA0BE",
              transition: "all .15s",
            }}>{label}</button>
          ))}
        </div>
      </header>

      <main style={{ padding: "18px 16px 48px", maxWidth: 520, margin: "0 auto" }}>

        {/* ══ SEMANA ══ */}
        {activeTab === "semana" && (
          <>
            {/* Day selector */}
            <div className="hide-scrollbar" style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 2 }}>
              {DAYS.map((d, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{
                  flexShrink: 0, width: 52, padding: "10px 0",
                  borderRadius: 14, border: "2px solid",
                  borderColor: activeDay === i ? T.amber : T.parchment,
                  background:  activeDay === i ? T.navy  : T.white,
                  color:       activeDay === i ? T.white : T.ink,
                  fontWeight: 700, fontSize: 13, cursor: "pointer", position: "relative",
                }}>
                  {d}
                  {SCHEDULE[i] && (
                    <div style={{
                      position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                      width: 5, height: 5, borderRadius: "50%",
                      background: activeDay === i ? T.amber : T.mint,
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div style={{
              background: T.white, borderRadius: 18,
              padding: "16px 14px 16px 50px",
              boxShadow: "0 2px 16px rgba(27,43,75,.07)",
              position: "relative",
              minHeight: mpx(DAY_END - DAY_START) + 32,
            }}>
              {/* Hour marks */}
              {Array.from({ length: (DAY_END - DAY_START) / 60 + 1 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: 0, top: mpx(i * 60) + 16, right: 0 }}>
                  <span style={{ position: "absolute", left: 6, fontSize: 10, color: T.slate, transform: "translateY(-50%)", fontVariantNumeric: "tabular-nums" }}>
                    {String(DAY_START / 60 + i).padStart(2, "0")}:00
                  </span>
                  <div style={{ position: "absolute", left: 46, right: 12, height: 1, background: T.parchment, top: 0 }} />
                </div>
              ))}

              {/* Empty state */}
              {dayEvents.length === 0 && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: T.slate }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>😴</div>
                  <div style={{ fontWeight: 600 }}>Día libre</div>
                  <div style={{ fontSize: 13 }}>No hay clases programadas</div>
                </div>
              )}

              {/* Events */}
              {dayEvents.map((ev, idx) => {
                const top    = mpx(timeToMinutes(ev.time) - DAY_START);
                const height = Math.max(mpx(ev.duration) - 4, 28);
                const subj   = ev.subjectId ? subjectOf(ev.subjectId) : null;
                const color  = subj ? subj.color : ev.color;
                const soft   = subj ? subj.soft  : ev.soft;
                const label  = subj ? subj.name  : ev.label;
                const icon   = subj ? subj.icon  : "🎮";
                return (
                  <div key={idx} style={{
                    position: "absolute", top: top + 16, left: 48, right: 12,
                    height, borderRadius: 12,
                    background: soft, borderLeft: `4px solid ${color}`,
                    padding: "6px 10px", overflow: "hidden",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{label}</span>
                    </div>
                    {height > 38 && (
                      <div style={{ fontSize: 11, color: T.slate, marginTop: 2 }}>
                        {ev.time} · {ev.duration} min{ev.room ? ` · ${ev.room}` : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chips */}
            {dayEvents.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                {dayEvents.map((ev, i) => {
                  const subj  = ev.subjectId ? subjectOf(ev.subjectId) : null;
                  const color = subj ? subj.color : ev.color;
                  const label = subj ? subj.name  : "Juego";
                  const icon  = subj ? subj.icon  : "🎮";
                  return (
                    <span key={i} style={{
                      padding: "5px 12px", borderRadius: 20,
                      background: color + "22", border: `1.5px solid ${color}55`,
                      fontSize: 12, fontWeight: 600, color: T.ink,
                    }}>{icon} {label}</span>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══ MATERIAS ══ */}
        {activeTab === "materias" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SUBJECTS.map((s) => (
              <div key={s.id} style={{ background: T.white, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 14px rgba(27,43,75,.06)" }}>
                <button
                  onClick={() => setExpandedSubject(expandedSubject === s.id ? null : s.id)}
                  style={{ width: "100%", background: "none", border: "none", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: T.ink }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: T.slate }}>{s.teacher}</div>
                    <div style={{ marginTop: 8, height: 5, borderRadius: 3, background: T.parchment, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.progress}%`, background: s.color, borderRadius: 3, transition: "width .4s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, color: T.slate, marginTop: 3 }}>Temario: {s.progress}% completado</div>
                  </div>
                  <span style={{ fontSize: 18, color: T.slate, display: "inline-block", transform: expandedSubject === s.id ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
                </button>

                {expandedSubject === s.id && (
                  <div style={{ borderTop: `1px solid ${T.parchment}`, padding: "14px 18px 18px" }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: T.slate, marginBottom: 10, letterSpacing: ".08em", textTransform: "uppercase" }}>Temario</div>
                    {s.topics.map((topic, idx) => {
                      const done = idx / s.topics.length < s.progress / 100;
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: idx < s.topics.length - 1 ? `1px solid ${T.parchment}` : "none" }}>
                          <div style={{ width: 22, height: 22, borderRadius: 6, background: done ? s.color : T.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, color: T.white }}>
                            {done ? "✓" : ""}
                          </div>
                          <span style={{ fontSize: 14, color: done ? T.ink : T.slate, fontWeight: done ? 500 : 400 }}>{topic}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ OBJETIVOS ══ */}
        {activeTab === "objetivos" && (
          <>
            {/* Summary card */}
            <div style={{ background: T.navy, borderRadius: 18, padding: "18px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
              <div>
                <div style={{ color: T.amber, fontWeight: 800, fontSize: 36, lineHeight: 1 }}>
                  {goals.filter((g) => g.done).length}
                  <span style={{ fontSize: 20, color: "#8BA0BE" }}>/{goals.length}</span>
                </div>
                <div style={{ color: "#8BA0BE", fontSize: 13, marginTop: 4 }}>objetivos logrados</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, borderRadius: 4, background: "#263854", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: T.amber, width: `${(goals.filter((g) => g.done).length / goals.length) * 100}%`, transition: "width .4s" }} />
                </div>
                <div style={{ color: "#8BA0BE", fontSize: 12, marginTop: 6 }}>
                  {Math.round((goals.filter((g) => g.done).length / goals.length) * 100)}% completado
                </div>
              </div>
            </div>

            {/* Goals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {goals.map((g) => {
                const subj = g.subjectId ? subjectOf(g.subjectId) : null;
                return (
                  <button key={g.id} onClick={() => toggleGoal(g.id)} style={{
                    background: g.done ? T.mintSoft : T.white,
                    border: `2px solid ${g.done ? T.mint : T.parchment}`,
                    borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 14,
                    cursor: "pointer", textAlign: "left", transition: "all .15s",
                    width: "100%",
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                      border: `2.5px solid ${g.done ? T.mint : T.parchment}`,
                      background: g.done ? T.mint : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: T.white,
                    }}>{g.done ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.ink, textDecoration: g.done ? "line-through" : "none", opacity: g.done ? 0.6 : 1 }}>
                        {g.text}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
                        {subj ? (
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: subj.color + "22", color: T.ink }}>
                            {subj.icon} {subj.name}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: T.coralSoft, color: T.ink }}>
                            🎮 Bienestar
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: T.slate }}>📅 {g.due}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
