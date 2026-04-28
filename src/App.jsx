import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Timer, AlertTriangle, Brain, Volume2, Thermometer,
  Wind, Zap, ChevronDown, Monitor, Sliders,
  CheckCircle, XCircle, Users, Menu, X
} from 'lucide-react'
import {
  taskTimeByTask, workloadByTask, errorsByTask,
  taskTimeByAge, surveyStats
} from './data'
import bmw2016 from './assets/bmw-2016-interior.avif'
import bmw2026 from './assets/bmw-2026-interior.avif'
import './App.css'

// ── Palette ──────────────────────────────────────────────────────────────────
const BG      = '#ffffff'
const BG_ALT  = '#f8fafc'
const CARD    = '#ffffff'
const BORDER  = '#e2e8f0'
const HEADING = '#0f172a'
const TEXT    = '#334155'
const SUBTEXT = '#64748b'
const MUTED   = '#94a3b8'
const PHYS    = '#2563eb'   // 2016 / physical — chart & legend only
const TOUCH   = '#f97316'   // 2026 / touchscreen — chart & legend only

// ── Shared ───────────────────────────────────────────────────────────────────
function Tag({ children }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase mb-3"
      style={{ color: SUBTEXT }}>
      {children}
    </p>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-3"
      style={{ color: HEADING }}>
      {children}
    </h2>
  )
}

function Body({ children, className = '' }) {
  return (
    <p style={{ color: SUBTEXT }}
      className={`text-sm md:text-base leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

function Card({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-xl p-5 ${className}`}
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        ...style,
      }}>
      {children}
    </div>
  )
}

function ChartCard({ title, note, children }) {
  return (
    <Card>
      <p className="font-semibold text-sm mb-0.5" style={{ color: HEADING }}>{title}</p>
      {note && <p className="text-xs mb-4" style={{ color: MUTED }}>{note}</p>}
      {children}
    </Card>
  )
}

function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: `1px solid ${BORDER}`,
      borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }} className="px-4 py-3 text-sm">
      <p className="font-semibold mb-1" style={{ color: HEADING }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}{unit}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Problem',  href: '#problem' },
  { label: 'Method',   href: '#test' },
  { label: 'Results',  href: '#results' },
  { label: 'Survey',   href: '#survey' },
  { label: 'Takeaway', href: '#recommendation' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background:    scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom:  scrolled ? `1px solid ${BORDER}` : 'none',
        boxShadow:     scrolled ? '0 1px 0 rgba(0,0,0,0.04)' : 'none',
      }}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: MUTED }}>
          ENGL 1106
        </span>
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:bg-black/5"
              style={{ color: SUBTEXT }}>
              {l.label}
            </a>
          ))}
        </div>
        <button className="md:hidden p-2 rounded-lg hover:bg-black/5"
          onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={18} color={HEADING} /> : <Menu size={18} color={HEADING} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4"
          style={{ background: 'rgba(255,255,255,0.98)', borderBottom: `1px solid ${BORDER}` }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm border-b transition-colors hover:opacity-60"
              style={{ color: TEXT, borderColor: BORDER }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative pt-20 pb-20 overflow-hidden">
      {/* Gradient wash */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 110% 65% at 50% -5%, #dbeafe 0%, #f0f9ff 35%, #ffffff 70%)',
      }} />

      <div className="relative max-w-5xl mx-auto px-6 pt-16">
        <Tag>Research Project — Spring 2026</Tag>

        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-4"
          style={{ color: HEADING }}>
          Touchscreens vs.<br />
          Physical Controls
        </h1>

        <p className="text-lg md:text-xl font-normal mb-6" style={{ color: SUBTEXT }}>
          Which one distracts drivers more?
        </p>

        <p className="text-sm md:text-base max-w-xl mb-10 leading-relaxed" style={{ color: SUBTEXT }}>
          Cars are replacing physical buttons and knobs with touchscreen interfaces
          for everyday tasks like adjusting temperature, fan speed, volume, and defrost.
          This project compares how drivers think about that tradeoff vs. how they
          actually perform when tested in both environments.
        </p>

        {/* Finding badge */}
        <div className="inline-flex items-center gap-2.5 mb-12 px-4 py-2.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}>
          <CheckCircle size={15} style={{ color: '#16a34a' }} />
          <span className="text-sm font-medium" style={{ color: HEADING }}>
            Finding: Physical controls were faster, less error-prone, and less mentally demanding.
          </span>
        </div>

        <div className="flex flex-col items-start gap-1.5" style={{ color: MUTED }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" style={{ color: MUTED }} />
        </div>
      </div>
    </section>
  )
}

// ── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  const cards = [
    { icon: <Timer size={22} />,        title: 'More Time',     color: '#d97706',
      text: 'A simple knob turn becomes a menu search, a tap, a correction, and another glance down.' },
    { icon: <AlertTriangle size={22} />, title: 'More Errors',   color: TOUCH,
      text: 'No tactile feedback means it is easier to hit the wrong control, especially on uneven roads.' },
    { icon: <Brain size={22} />,        title: 'More Workload', color: '#7c3aed',
      text: 'Searching through nested menus pulls mental resources away from the driving task itself.' },
  ]
  return (
    <section id="problem" className="py-20"
      style={{ background: BG_ALT, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-12">
          <Tag>The Problem</Tag>
          <SectionHeading>Why This Matters</SectionHeading>
          <Body>
            Driving already requires divided attention. When basic controls move into
            touchscreen menus, simple actions take more steps, more glances, and more
            mental effort. In a moving car, those extra seconds matter.
          </Body>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map(c => (
            <Card key={c.title}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${c.color}12`, color: c.color }}>
                {c.icon}
              </div>
              <p className="font-semibold text-sm mb-2" style={{ color: HEADING }}>{c.title}</p>
              <Body>{c.text}</Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Interior Comparison ───────────────────────────────────────────────────────
function InteriorComparison() {
  return (
    <section className="py-20" style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-10">
          <Tag>The Test Vehicles</Tag>
          <SectionHeading>Two Generations, Two Interfaces</SectionHeading>
          <Body>
            The 2016 M3 (F80 generation) uses physical knobs, buttons, and the iDrive
            rotary controller for most functions. The 2026 M3 moves the same controls
            into a touchscreen-first layout. Same brand, same tasks, very different
            experience.
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              year: '2016', src: bmw2016,
              label: 'Physical-primary', color: PHYS,
              caption: 'Rotary controller, dedicated HVAC dials, and physical buttons for common tasks.',
            },
            {
              year: '2026', src: bmw2026,
              label: 'Touchscreen-heavy', color: TOUCH,
              caption: 'Large curved display handles most controls. Physical buttons reduced significantly.',
            },
          ].map(c => (
            <div key={c.year} className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${BORDER}`, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div className="relative">
                <img src={c.src} alt={`${c.year} BMW M3 interior`}
                  className="w-full object-cover"
                  style={{ height: 240 }} />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: '#fff', background: 'rgba(0,0,0,0.55)', border: `1px solid ${c.color}70` }}>
                    {c.label}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4" style={{ background: BG }}>
                <p className="font-bold text-sm mb-1" style={{ color: HEADING }}>{c.year} BMW M3</p>
                <p className="text-xs leading-relaxed" style={{ color: SUBTEXT }}>{c.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Test / Method ─────────────────────────────────────────────────────────────
function Test() {
  const tasks = [
    { icon: <Volume2 size={16} />,     label: 'Adjust volume' },
    { icon: <Thermometer size={16} />, label: 'Change temperature' },
    { icon: <Wind size={16} />,        label: 'Adjust fan speed' },
    { icon: <Zap size={16} />,         label: 'Turn on front defrost' },
  ]
  const metrics = [
    { icon: <Timer size={18} />,        label: 'Task Time',       sub: 'Seconds per action' },
    { icon: <AlertTriangle size={18} />, label: 'Error Count',     sub: 'Wrong taps / misses' },
    { icon: <Brain size={18} />,        label: 'Workload Rating', sub: '1–10 self-report scale' },
    { icon: <Users size={18} />,        label: 'Survey',          sub: '60 total respondents' },
  ]
  return (
    <section id="test" className="py-20"
      style={{ background: BG_ALT, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <Tag>Methodology</Tag>
            <SectionHeading>How I Tested It</SectionHeading>
            <Body className="mb-6">
              I ran two tests. First, a 60-person survey measuring perceived distraction for
              each interface type. Second, a parked task test comparing a 2016 BMW M3
              (physical-primary) to a 2026 BMW M3 (touchscreen-heavy). Participants
              completed four tasks while I recorded time, errors, and workload.
            </Body>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.label} className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                  style={{ background: BG, border: `1px solid ${BORDER}` }}>
                  <span style={{ color: SUBTEXT }}>{t.icon}</span>
                  <span className="text-sm" style={{ color: TEXT }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: HEADING }}>Metrics Collected</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {metrics.map(m => (
                <Card key={m.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: BG_ALT, color: SUBTEXT }}>
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: HEADING }}>{m.label}</p>
                    <p className="text-xs" style={{ color: MUTED }}>{m.sub}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${BORDER}` }}>
              <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                style={{ background: BG_ALT, color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                Vehicles Tested
              </div>
              {[
                { year: '2016', type: 'Physical-primary',    color: PHYS },
                { year: '2026', type: 'Touchscreen-primary', color: TOUCH },
              ].map((r, i) => (
                <div key={r.year} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i === 0 ? `1px solid ${BORDER}` : 'none', background: CARD }}>
                  <span className="font-bold text-sm" style={{ color: HEADING }}>{r.year}
                    <span className="font-normal ml-1.5" style={{ color: SUBTEXT }}>BMW M3</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: r.color, background: `${r.color}12`, border: `1px solid ${r.color}30` }}>
                    {r.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Results ──────────────────────────────────────────────────────────────────
function StatPill({ value, label, color }) {
  return (
    <Card className="text-center">
      <p className="text-3xl font-black mb-0.5" style={{ color }}>{value}</p>
      <p className="text-xs leading-snug" style={{ color: MUTED }}>{label}</p>
    </Card>
  )
}

function Results() {
  const timeByTask = useMemo(() => taskTimeByTask(),  [])
  const wlByTask   = useMemo(() => workloadByTask(),  [])
  const errByTask  = useMemo(() => errorsByTask(),    [])
  const timeByAge  = useMemo(() => taskTimeByAge(),   [])

  const axisProps = { tick: { fill: SUBTEXT, fontSize: 11 }, axisLine: false, tickLine: false }

  return (
    <section id="results" className="py-20"
      style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-12">
          <Tag>Data</Tag>
          <SectionHeading>What I Found</SectionHeading>
          <Body>
            Across every task and every age group, the 2026 touchscreen setup took longer,
            produced more errors, and felt more demanding. The gaps were largest on fan
            speed and defrost, both buried in sub-menus on the 2026 car.
          </Body>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ChartCard title="Avg. Task Completion Time"
            note="Seconds per task, averaged across all 60 participants">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={timeByTask} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="task" {...axisProps} />
                <YAxis {...axisProps} unit="s" />
                <Tooltip content={<ChartTooltip unit="s" />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend wrapperStyle={{ color: SUBTEXT, fontSize: 11 }} />
                <Bar dataKey="BMW 2016" fill={PHYS}  radius={[3,3,0,0]} />
                <Bar dataKey="BMW 2026" fill={TOUCH} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Avg. Mental Workload by Task"
            note="Self-reported workload, 1–10 scale">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={wlByTask} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="task" {...axisProps} />
                <YAxis {...axisProps} domain={[0,10]} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend wrapperStyle={{ color: SUBTEXT, fontSize: 11 }} />
                <Bar dataKey="BMW 2016" fill={PHYS}  radius={[3,3,0,0]} />
                <Bar dataKey="BMW 2026" fill={TOUCH} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ChartCard title="Avg. Errors per Task"
            note="Wrong taps, missed inputs, or required corrections">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={errByTask} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="task" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend wrapperStyle={{ color: SUBTEXT, fontSize: 11 }} />
                <Bar dataKey="BMW 2016" fill={PHYS}  radius={[3,3,0,0]} />
                <Bar dataKey="BMW 2026" fill={TOUCH} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Avg. Task Time by Age Group"
            note="Averaged across all four tasks">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={timeByAge} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="group" {...axisProps} />
                <YAxis {...axisProps} unit="s" />
                <Tooltip content={<ChartTooltip unit="s" />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend wrapperStyle={{ color: SUBTEXT, fontSize: 11 }} />
                <Bar dataKey="BMW 2016" fill={PHYS}  radius={[3,3,0,0]} />
                <Bar dataKey="BMW 2026" fill={TOUCH} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatPill value={`${timeByTask[3]['BMW 2016']}s`}  label="2016 avg defrost time"         color={PHYS} />
          <StatPill value={`${timeByTask[3]['BMW 2026']}s`}  label="2026 avg defrost time"         color={TOUCH} />
          <StatPill value={`${wlByTask[2]['BMW 2016']}`}     label="2016 fan speed workload (avg)" color={PHYS} />
          <StatPill value={`${wlByTask[2]['BMW 2026']}`}     label="2026 fan speed workload (avg)" color={TOUCH} />
        </div>
      </div>
    </section>
  )
}

// ── Survey ───────────────────────────────────────────────────────────────────
function Survey() {
  const stats = useMemo(() => surveyStats(), [])

  return (
    <section id="survey" className="py-20"
      style={{ background: BG_ALT, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <Tag>Survey Results</Tag>
            <SectionHeading>What Drivers Said</SectionHeading>
            <Body className="mb-6">
              Before seeing any test results, 60 drivers rated how distracting they found
              each interface. Touchscreens averaged{' '}
              <strong style={{ color: HEADING }}>{stats.tsAvg}/10</strong> on distraction,
              compared to{' '}
              <strong style={{ color: HEADING }}>{stats.btnAvg}/10</strong> for physical buttons.{' '}
              {stats.prefButtons} out of 60 preferred physical controls for everyday tasks.
            </Body>
            <Body>
              The survey results lined up with what the task test showed. People already
              rated touchscreens as significantly more distracting, and the performance
              data confirmed the gap is real, not just a perception.
            </Body>
          </div>

          <div className="space-y-4">
            <Card>
              <p className="text-xs font-semibold mb-4" style={{ color: HEADING }}>
                Avg. Distraction Rating (out of 10)
              </p>
              {[
                { label: 'Touchscreen controls', value: stats.tsAvg,  color: TOUCH },
                { label: 'Physical controls',    value: stats.btnAvg, color: PHYS },
              ].map(r => (
                <div key={r.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs" style={{ color: TEXT }}>{r.label}</span>
                    <span className="text-xs font-bold" style={{ color: r.color }}>{r.value}/10</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${(r.value / 10) * 100}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <p className="text-xs font-semibold mb-4" style={{ color: HEADING }}>
                Interface Preference (n=60)
              </p>
              <div className="flex items-center gap-5">
                <div className="relative shrink-0 w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={PHYS} strokeWidth="3.5"
                      strokeDasharray={`${(stats.prefButtons / 60) * 100} ${100 - (stats.prefButtons / 60) * 100}`}
                      strokeLinecap="round" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={TOUCH} strokeWidth="3.5"
                      strokeDasharray={`${(stats.prefTouchscreen / 60) * 100} ${100 - (stats.prefTouchscreen / 60) * 100}`}
                      strokeDashoffset={`-${(stats.prefButtons / 60) * 100}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black" style={{ color: HEADING }}>
                      {Math.round((stats.prefButtons / 60) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2.5 flex-1">
                  {[
                    { label: 'Physical Buttons', count: stats.prefButtons,     color: PHYS },
                    { label: 'Touchscreen',       count: stats.prefTouchscreen, color: TOUCH },
                  ].map(i => (
                    <div key={i.label} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: i.color }} />
                      <span className="text-xs flex-1" style={{ color: TEXT }}>{i.label}</span>
                      <span className="text-xs font-bold" style={{ color: i.color }}>{i.count}</span>
                    </div>
                  ))}
                  <p className="text-xs" style={{ color: MUTED }}>60 total respondents</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Counterargument ──────────────────────────────────────────────────────────
function Counterargument() {
  return (
    <section id="counterargument" className="py-20"
      style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-12">
          <Tag>Counterpoint</Tag>
          <SectionHeading>Aren't Touchscreens More Modern?</SectionHeading>
          <Body>
            Touchscreens do have real advantages. They reduce button clutter, can be
            updated through software, and feel familiar to people used to smartphones.
            But driving is not the same as using a phone on a couch. Basic controls need
            to work fast, with minimal visual attention, and that is where physical buttons
            still have the edge.
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Monitor size={18} />, title: 'Touchscreens', color: TOUCH,
              IconComp: XCircle,
              items: ['Cleaner dashboard layout', 'Updatable via software', 'Modern, familiar feel'],
            },
            {
              icon: <Sliders size={18} />, title: 'Physical Controls', color: PHYS,
              IconComp: CheckCircle,
              items: ['Faster for common tasks', 'Tactile feedback, no need to look', 'Lower mental workload'],
            },
          ].map(col => (
            <Card key={col.title}
              style={{ borderColor: `${col.color}30` }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${col.color}10`, color: col.color }}>
                  {col.icon}
                </div>
                <p className="font-semibold text-sm" style={{ color: HEADING }}>{col.title}</p>
              </div>
              <ul className="space-y-2.5">
                {col.items.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: SUBTEXT }}>
                    <col.IconComp size={14} style={{ color: col.color }} className="shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Recommendation ───────────────────────────────────────────────────────────
function Recommendation() {
  return (
    <section id="recommendation" className="py-20"
      style={{ background: BG_ALT, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-12">
          <Tag>Takeaway</Tag>
          <SectionHeading>So What Should Car Designers Do?</SectionHeading>
          <Body>
            Keep physical controls for the tasks drivers use most often: temperature,
            fan speed, volume, and defrost. Touchscreens work fine for navigation,
            media browsing, and settings that do not need to be changed while driving.
            The goal is not to pick one or the other, but to put the right interface in
            the right place.
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl">
          {[
            {
              color: PHYS, label: 'Keep Physical', IconComp: CheckCircle,
              items: ['Temperature control', 'Fan speed', 'Volume', 'Front defrost'],
              bg: `${PHYS}08`,
            },
            {
              color: TOUCH, label: 'Touchscreen OK For', IconComp: Monitor,
              items: ['Navigation and maps', 'Media and playlists', 'Deep settings menus', 'Phone / connectivity'],
              bg: `${TOUCH}08`,
            },
          ].map(col => (
            <Card key={col.label} style={{ borderColor: `${col.color}25`, background: col.bg }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: col.color }}>
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: SUBTEXT }}>
                    <col.IconComp size={13} style={{ color: col.color }} className="shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Body className="max-w-xl">
          The data is clear: basic driving controls work better when they are
          physical. That is not a matter of preference or nostalgia. It shows up
          in the times, the error counts, and the workload ratings. Car designers
          should use that evidence when deciding what belongs on a screen and
          what belongs on the dash.
        </Body>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8" style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs" style={{ color: MUTED }}>
          Research by{' '}
          <span className="font-medium" style={{ color: TEXT }}>Juan Francisco Griffies-Benito</span>
          {' '}| ENGL 1106 | Spring 2026
        </p>
        <p className="text-xs" style={{ color: MUTED }}>Touchscreens vs. Physical Controls</p>
      </div>
    </footer>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <Problem />
      <InteriorComparison />
      <Test />
      <Results />
      <Survey />
      <Counterargument />
      <Recommendation />
      <Footer />
    </div>
  )
}
