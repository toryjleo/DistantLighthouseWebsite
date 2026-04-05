import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'distant-lighthouse-cyberpunk-ledger'
const PDF_PATH = '/pdfs/cyberpunk2020.pdf'
const PDF_REFERENCE_PATH = '/pdfs/cyberpunk2020.pdf#page=61'
const DOWNLOAD_ART_PATH = '/Cyberpunk/cyberpunk-2020-review-header-990x557.webp'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)

const parseNumber = (value) => {
  const parsed = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}

const sumEntriesByCadence = (entries, cadence) =>
  entries.reduce(
    (sum, entry) => sum + (entry.cadence === cadence ? parseNumber(entry.amount) : 0),
    0,
  )

const sumPendingOneTimeEntries = (entries) =>
  entries.reduce(
    (sum, entry) =>
      sum + (entry.cadence === 'One-time' && !entry.isApplied ? parseNumber(entry.amount) : 0),
    0,
  )

const advanceMonthLabel = (monthLabel) => {
  const parsed = new Date(`${monthLabel} 1`)
  if (Number.isNaN(parsed.getTime())) return monthLabel

  parsed.setMonth(parsed.getMonth() + 1)
  return parsed.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

const createEntry = (overrides = {}) => ({
  id: crypto.randomUUID(),
  label: '',
  amount: '0',
  cadence: 'Monthly',
  note: '',
  isApplied: false,
  ...overrides,
})

const defaultLedger = {
  handle: 'Rogue Team',
  monthLabel: new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
  stashOnHand: '1800',
  notes:
    'Use this as the party-facing ledger for rent, transport, ammo, medtech bills, and hustle payouts. Edit the rows to match your table.',
  incomes: [
    createEntry({
      label: 'Primary hustle',
      amount: '2200',
      cadence: 'Monthly',
      note: 'Recurring gig income',
    }),
    createEntry({
      label: 'Side contract',
      amount: '450',
      cadence: 'One-time',
      note: 'Only lands this month if the team closes the job',
    }),
  ],
  expenses: [
    createEntry({
      label: 'Rent / safehouse',
      amount: '800',
      cadence: 'Monthly',
      note: 'Apartment, cargo container, or group crash pad',
    }),
    createEntry({
      label: 'Food / kibble / drinks',
      amount: '300',
      cadence: 'Monthly',
      note: 'Lifestyle baseline',
    }),
    createEntry({
      label: 'Ammo and repairs',
      amount: '175',
      cadence: 'One-time',
      note: 'Swap this for whatever the crew burned through',
    }),
    createEntry({
      label: 'Trauma Team / clinic / meds',
      amount: '250',
      cadence: 'Monthly',
      note: 'Medical safety net',
    }),
  ],
}

const upcomingModules = [
  {
    title: 'Inventory ledger',
    description:
      'Track owned weapons, cyberware, spare gear, and stash locations in the same save file.',
  },
  {
    title: 'Weight and encumbrance',
    description:
      'Add carried weight, vehicle storage, and penalties once you are ready for the crunchier layer.',
  },
  {
    title: 'Crew share calculator',
    description:
      'Split gig payouts by player, fixer cut, party stash, and debt repayment.',
  },
]

export const buildCsv = (ledger) => {
  const incomeTotal = ledger.incomes.reduce(
    (sum, entry) => sum + parseNumber(entry.amount),
    0,
  )
  const expenseTotal = ledger.expenses.reduce(
    (sum, entry) => sum + parseNumber(entry.amount),
    0,
  )
  const monthlyIncome = sumEntriesByCadence(ledger.incomes, 'Monthly')
  const monthlyExpenses = sumEntriesByCadence(ledger.expenses, 'Monthly')
  const oneTimeIncome = sumPendingOneTimeEntries(ledger.incomes)
  const oneTimeExpenses = sumPendingOneTimeEntries(ledger.expenses)
  const currentStash = parseNumber(ledger.stashOnHand)
  const projectedStash = currentStash + (incomeTotal - expenseTotal)

  const rows = [
    ['Ledger field', 'Value'],
    ['Crew / character handle', ledger.handle],
    ['Month label', ledger.monthLabel],
    ['Current stash', currentStash.toFixed(2)],
    ['GM / table notes', ledger.notes.replace(/\r?\n/g, ' ')],
    ['Total listed income', incomeTotal.toFixed(2)],
    ['Total listed expenses', expenseTotal.toFixed(2)],
    ['Monthly income', monthlyIncome.toFixed(2)],
    ['Monthly expenses', monthlyExpenses.toFixed(2)],
    ['Pending one-time income', oneTimeIncome.toFixed(2)],
    ['Pending one-time expenses', oneTimeExpenses.toFixed(2)],
    ['Projected stash if all rows apply', projectedStash.toFixed(2)],
    [],
    ['Section', 'Label', 'Amount', 'Cadence', 'Applied', 'Note'],
    ...ledger.incomes.map((entry) => [
      'Jobs and gigs',
      entry.label,
      parseNumber(entry.amount).toFixed(2),
      entry.cadence,
      entry.isApplied ? 'Yes' : 'No',
      entry.note.replace(/\r?\n/g, ' '),
    ]),
    ...ledger.expenses.map((entry) => [
      'Expense',
      entry.label,
      parseNumber(entry.amount).toFixed(2),
      entry.cadence,
      entry.isApplied ? 'Yes' : 'No',
      entry.note.replace(/\r?\n/g, ' '),
    ]),
  ]

  return rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')
}

function LedgerTable({
  title,
  accentClassName,
  entries,
  total,
  addLabel,
  onAdd,
  onUpdate,
  onRemove,
  isCollapsed,
  onToggle,
}) {
  return (
    <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-4 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-end gap-4 text-left"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-white/40">{title}</p>
            <div className="mt-3 flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold text-white">{formatCurrency(total)}</h2>
              <span className={`text-sm ${accentClassName}`}>Current month total</span>
            </div>
          </div>
          <span className="mb-1 text-xs uppercase tracking-[0.24em] text-white/45">
            {isCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.24em] text-white/35">
            {entries.length} rows
          </span>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/80 transition hover:border-white/35 hover:text-white"
          >
            {addLabel}
          </button>
        </div>
      </div>

      {isCollapsed ? null : (
      <div className="mt-6 space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-[1.75rem] border border-red-700/30 bg-white/[0.03] p-4"
          >
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/35">
              <div className="flex items-center gap-2">
                <span>{title} row {index + 1}</span>
                {entry.cadence === 'One-time' && entry.isApplied && (
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[10px] tracking-[0.2em] text-emerald-200">
                    Applied
                  </span>
                )}
              </div>
              <span>{formatCurrency(parseNumber(entry.amount))}</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_160px_minmax(0,1fr)_120px]">
              <label className="space-y-2 text-sm text-white/70">
                <span>Label</span>
                <input
                  type="text"
                  value={entry.label}
                  onChange={(event) => onUpdate(entry.id, 'label', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                />
              </label>

              <label className="space-y-2 text-sm text-white/70">
                <span>Amount</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={entry.amount}
                  onChange={(event) => onUpdate(entry.id, 'amount', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                />
              </label>

              <label className="space-y-2 text-sm text-white/70">
                <span>Cadence</span>
                <select
                  value={entry.cadence}
                  onChange={(event) => onUpdate(entry.id, 'cadence', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>One-time</option>
                  <option>Per job</option>
                </select>
              </label>

              <div className="space-y-2">
                <span className="block text-sm text-white/70 lg:invisible">Remove</span>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  disabled={entries.length === 1}
                  className="w-full rounded-2xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/65 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>

            <label className="mt-4 block space-y-2 text-sm text-white/70">
              <span>Note</span>
              <input
                type="text"
                value={entry.note}
                onChange={(event) => onUpdate(entry.id, 'note', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
              />
            </label>

            {entry.cadence === 'One-time' && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => onUpdate(entry.id, 'isApplied', !entry.isApplied)}
                  className="rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/75 transition hover:border-white/30 hover:text-white"
                >
                  {entry.isApplied ? 'Mark unapplied' : 'Mark applied'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </section>
  )
}

export default function CyberpunkLedger() {
  const [ledger, setLedger] = useState(defaultLedger)
  const [saveMessage, setSaveMessage] = useState('Autosaves on this device.')
  const [hasHydrated, setHasHydrated] = useState(false)
  const [monthlyCloseHistory, setMonthlyCloseHistory] = useState([])
  const [collapsedSections, setCollapsedSections] = useState({
    gigs: false,
    expenses: false,
  })
  const [displayedStash, setDisplayedStash] = useState(parseNumber(defaultLedger.stashOnHand))
  const stashAnimationRef = useRef(parseNumber(defaultLedger.stashOnHand))

  useEffect(() => {
    const savedLedger = window.localStorage.getItem(STORAGE_KEY)
    if (!savedLedger) {
      setHasHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(savedLedger)
      setLedger({
        ...defaultLedger,
        ...parsed,
        incomes: Array.isArray(parsed.incomes) && parsed.incomes.length > 0
          ? parsed.incomes.map((entry) => createEntry(entry))
          : defaultLedger.incomes,
        expenses: Array.isArray(parsed.expenses) && parsed.expenses.length > 0
          ? parsed.expenses.map((entry) => createEntry(entry))
          : defaultLedger.expenses,
      })
      setSaveMessage('Loaded your last ledger from this device.')
    } catch {
      setSaveMessage('Saved data was unreadable, so the starter ledger stayed loaded.')
    } finally {
      setHasHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hasHydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger))
  }, [hasHydrated, ledger])

  const totals = useMemo(() => {
    const incomeTotal = ledger.incomes.reduce(
      (sum, entry) => sum + parseNumber(entry.amount),
      0,
    )
    const expenseTotal = ledger.expenses.reduce(
      (sum, entry) => sum + parseNumber(entry.amount),
      0,
    )
    const net = incomeTotal - expenseTotal
    const currentStash = parseNumber(ledger.stashOnHand)
    const pendingIncome = ledger.incomes.reduce((sum, entry) => {
      if (entry.cadence === 'One-time' && entry.isApplied) return sum
      return sum + parseNumber(entry.amount)
    }, 0)
    const pendingExpenses = ledger.expenses.reduce((sum, entry) => {
      if (entry.cadence === 'One-time' && entry.isApplied) return sum
      return sum + parseNumber(entry.amount)
    }, 0)
    const projectedStash = currentStash + (pendingIncome - pendingExpenses)

    return {
      currentStash,
      incomeTotal,
      expenseTotal,
      net,
      pendingIncome,
      pendingExpenses,
      projectedStash,
    }
  }, [ledger])

  const monthlyCycleTotals = useMemo(() => {
    const monthlyIncome = sumEntriesByCadence(ledger.incomes, 'Monthly')
    const monthlyExpenses = sumEntriesByCadence(ledger.expenses, 'Monthly')
    const monthlyNet = monthlyIncome - monthlyExpenses

    return {
      monthlyIncome,
      monthlyExpenses,
      monthlyNet,
    }
  }, [ledger])

  const oneTimeTotals = useMemo(() => {
    const oneTimeIncome = sumPendingOneTimeEntries(ledger.incomes)
    const oneTimeExpenses = sumPendingOneTimeEntries(ledger.expenses)
    const oneTimeNet = oneTimeIncome - oneTimeExpenses
    const pendingCount = [...ledger.incomes, ...ledger.expenses].filter(
      (entry) => entry.cadence === 'One-time' && !entry.isApplied,
    ).length

    return {
      oneTimeIncome,
      oneTimeExpenses,
      oneTimeNet,
      pendingCount,
    }
  }, [ledger])

  useEffect(() => {
    const nextValue = totals.currentStash
    const startValue = stashAnimationRef.current

    if (startValue === nextValue) {
      setDisplayedStash(nextValue)
      return
    }

    const durationMs = 700
    const startedAt = performance.now()
    let frameId = 0

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / durationMs, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      const value = startValue + (nextValue - startValue) * eased
      setDisplayedStash(value)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
        return
      }

      stashAnimationRef.current = nextValue
      setDisplayedStash(nextValue)
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [totals.currentStash])

  const updateLedgerField = (name, value) => {
    setLedger((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const updateEntry = (group, id, field, value) => {
    setLedger((current) => ({
      ...current,
      [group]: current[group].map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    }))
  }

  const addEntry = (group, seedLabel) => {
    setLedger((current) => ({
      ...current,
      [group]: [
        createEntry({
          label: seedLabel,
          amount: '0',
          cadence: 'Monthly',
        }),
        ...current[group],
      ],
    }))
  }

  const removeEntry = (group, id) => {
    setLedger((current) => ({
      ...current,
      [group]:
        current[group].length === 1
          ? current[group]
          : current[group].filter((entry) => entry.id !== id),
    }))
  }

  const saveLocalSnapshot = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger))
    setSaveMessage(`Saved to this device at ${new Date().toLocaleTimeString()}.`)
  }

  const exportCsv = () => {
    const csv = buildCsv(ledger)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${ledger.handle || 'cyberpunk-ledger'}-${ledger.monthLabel || 'month'}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setSaveMessage('CSV exported for spreadsheet use.')
  }

  const applyMonthlyCycle = () => {
    setMonthlyCloseHistory((current) => [...current, structuredClone(ledger)])

    setLedger((current) => {
      const monthlyIncome = sumEntriesByCadence(current.incomes, 'Monthly')
      const monthlyExpenses = sumEntriesByCadence(current.expenses, 'Monthly')
      const monthlyNet = monthlyIncome - monthlyExpenses
      const nextStash = parseNumber(current.stashOnHand) + monthlyNet

      return {
        ...current,
        stashOnHand: String(nextStash),
        monthLabel: advanceMonthLabel(current.monthLabel),
      }
    })

    setSaveMessage(
      `Monthly close applied: ${formatCurrency(monthlyCycleTotals.monthlyNet)} and advanced to ${advanceMonthLabel(ledger.monthLabel)}.`,
    )
  }

  const undoMonthlyCycle = () => {
    if (monthlyCloseHistory.length === 0) return

    const previousLedger = monthlyCloseHistory[monthlyCloseHistory.length - 1]
    setLedger(previousLedger)
    setMonthlyCloseHistory((current) => current.slice(0, -1))
    setSaveMessage('Undid one monthly close.')
  }

  const applyOneTimeItems = () => {
    if (oneTimeTotals.pendingCount === 0) return

    setLedger((current) => {
      const oneTimeIncome = sumPendingOneTimeEntries(current.incomes)
      const oneTimeExpenses = sumPendingOneTimeEntries(current.expenses)
      const oneTimeNet = oneTimeIncome - oneTimeExpenses

      return {
        ...current,
        stashOnHand: String(parseNumber(current.stashOnHand) + oneTimeNet),
        incomes: current.incomes.map((entry) =>
          entry.cadence === 'One-time' ? { ...entry, isApplied: true } : entry,
        ),
        expenses: current.expenses.map((entry) =>
          entry.cadence === 'One-time' ? { ...entry, isApplied: true } : entry,
        ),
      }
    })

    setSaveMessage(
      `Applied ${oneTimeTotals.pendingCount} one-time item(s): ${formatCurrency(oneTimeTotals.oneTimeNet)}.`,
    )
  }

  const toggleSection = (section) => {
    setCollapsedSections((current) => ({
      ...current,
      [section]: !current[section],
    }))
  }

  const resetLedger = () => {
    setLedger({
      ...defaultLedger,
      monthLabel: new Date().toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      incomes: defaultLedger.incomes.map((entry) => createEntry(entry)),
      expenses: defaultLedger.expenses.map((entry) => createEntry(entry)),
    })
    setSaveMessage('Loaded a fresh starter ledger.')
  }

  return (
    <motion.section
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="cyber-grid-surface relative overflow-hidden rounded-[2.25rem] border border-red-600/25 bg-black p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:p-8 lg:p-10">
        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-red-400/80">
                Cyberpunk 2020 project sample
              </p>
              <h1 className="max-w-4xl text-3xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">
                Monthly crew income and expense ledger.
              </h1>
              <p className="max-w-2xl text-sm text-white/72 sm:text-base lg:text-lg">
                This is a browser-based tracking sheet for player finances: hustle money,
                recurring bills, one-off costs, and the crew stash. It is designed to be
                useful now and easy to expand into inventory and carry weight later.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-white lg:max-w-sm">
              {saveMessage}
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Current stash', value: formatCurrency(displayedStash), tone: 'text-white' },
              { label: 'All listed income', value: formatCurrency(totals.incomeTotal), tone: 'text-red-200' },
              { label: 'All listed expenses', value: formatCurrency(totals.expenseTotal), tone: 'text-red-300' },
              {
                label: 'Net from all rows',
                value: formatCurrency(totals.net),
                tone: totals.net >= 0 ? 'text-white' : 'text-red-300',
              },
              {
                label: 'Projected stash if all rows apply',
                value: formatCurrency(totals.projectedStash),
                tone: 'text-white',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">{stat.label}</p>
                <p className={`mt-4 text-2xl font-semibold ${stat.tone}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="space-y-6">
              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-4 backdrop-blur sm:p-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_200px]">
                  <label className="space-y-2 text-sm text-white/70">
                    <span>Crew / character handle</span>
                    <input
                      type="text"
                      value={ledger.handle}
                      onChange={(event) => updateLedgerField('handle', event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-white/70">
                    <span>Month label</span>
                    <input
                      type="text"
                      value={ledger.monthLabel}
                      onChange={(event) => updateLedgerField('monthLabel', event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-white/70">
                    <span>Current stash</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={ledger.stashOnHand}
                      onChange={(event) => updateLedgerField('stashOnHand', event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                    />
                  </label>
                </div>

                <label className="mt-4 block space-y-2 text-sm text-white/70">
                  <span>GM / table notes</span>
                  <textarea
                    rows="4"
                    value={ledger.notes}
                    onChange={(event) => updateLedgerField('notes', event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/55"
                  />
                </label>
              </section>

              <LedgerTable
                title="Jobs and gigs"
                accentClassName="text-emerald-200/85"
                entries={ledger.incomes}
                total={totals.incomeTotal}
                addLabel="Add income row"
                onAdd={() => addEntry('incomes', 'New income source')}
                onUpdate={(id, field, value) => updateEntry('incomes', id, field, value)}
                onRemove={(id) => removeEntry('incomes', id)}
                isCollapsed={collapsedSections.gigs}
                onToggle={() => toggleSection('gigs')}
              />

              <LedgerTable
                title="Expenses"
                accentClassName="text-orange-200/85"
                entries={ledger.expenses}
                total={totals.expenseTotal}
                addLabel="Add expense row"
                onAdd={() => addEntry('expenses', 'New monthly cost')}
                onUpdate={(id, field, value) => updateEntry('expenses', id, field, value)}
                onRemove={(id) => removeEntry('expenses', id)}
                isCollapsed={collapsedSections.expenses}
                onToggle={() => toggleSection('expenses')}
              />
            </div>

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">
                  Reference hook
                </p>
                <div className="mt-4 space-y-4 text-sm text-slate-100/80">
                  <p>
                    Book reference noted for setup: page 57 in the book, page 61 in the PDF.
                  </p>
                  <p>
                    I kept the default rows editable so we can drop in the exact expense table
                    once you want me to mirror that page line-for-line.
                  </p>
                  <p>
                    One-time purchases like a new gun are not applied by monthly close. They
                    now have their own apply flow so they hit the stash once and can be
                    marked applied.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={PDF_REFERENCE_PATH}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-cyan-200/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-50 transition hover:border-cyan-100/60"
                  >
                    Open PDF reference
                  </a>
                  <a
                    href={PDF_PATH}
                    download
                    className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80 transition hover:border-white/35 hover:text-white"
                  >
                    Download full PDF
                  </a>
                </div>
              </section>

              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  One-time items
                </p>
                <div className="mt-5 space-y-4 text-sm text-white/70">
                  <p>
                    Use this for a new gun, a surprise payout, bribe money, or any other
                    one-off change that should hit stash once and then stay accounted for.
                  </p>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span>Pending one-time income</span>
                      <span className="text-emerald-200">
                        {formatCurrency(oneTimeTotals.oneTimeIncome)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span>Pending one-time expenses</span>
                      <span className="text-orange-200">
                        {formatCurrency(oneTimeTotals.oneTimeExpenses)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                      <span>Net one-time change</span>
                      <span
                        className={
                          oneTimeTotals.oneTimeNet >= 0
                            ? 'text-cyan-100'
                            : 'text-rose-200'
                        }
                      >
                        {formatCurrency(oneTimeTotals.oneTimeNet)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={applyOneTimeItems}
                    disabled={oneTimeTotals.pendingCount === 0}
                    className="w-full rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50 transition hover:border-emerald-100/65 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Apply one-time items ({oneTimeTotals.pendingCount})
                  </button>
                </div>
              </section>

              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  Monthly close
                </p>
                <div className="mt-5 space-y-4 text-sm text-white/70">
                  <p>
                    This applies only rows marked <strong className="text-white">Monthly</strong>,
                    updates the stash, and moves the sheet to the next month.
                  </p>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span>Monthly income</span>
                      <span className="text-emerald-200">
                        {formatCurrency(monthlyCycleTotals.monthlyIncome)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span>Monthly expenses</span>
                      <span className="text-orange-200">
                        {formatCurrency(monthlyCycleTotals.monthlyExpenses)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                      <span>Monthly net</span>
                      <span
                        className={
                          monthlyCycleTotals.monthlyNet >= 0
                            ? 'text-cyan-100'
                            : 'text-rose-200'
                        }
                      >
                        {formatCurrency(monthlyCycleTotals.monthlyNet)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                      <span>Current stash after click</span>
                      <span className="text-fuchsia-200">
                        {formatCurrency(
                          parseNumber(ledger.stashOnHand) + monthlyCycleTotals.monthlyNet,
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={applyMonthlyCycle}
                    className="w-full rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-3 text-sm text-fuchsia-50 transition hover:border-fuchsia-100/65"
                  >
                    Run monthly close
                  </button>
                  <button
                    type="button"
                    onClick={undoMonthlyCycle}
                    disabled={monthlyCloseHistory.length === 0}
                    className="w-full rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/75 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Undo monthly close ({monthlyCloseHistory.length})
                  </button>
                </div>
              </section>

              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  PDF download image
                </p>
                <a
                  href={PDF_PATH}
                  download
                  className="group mt-5 block overflow-hidden rounded-[1.75rem] border border-cyan-300/20 bg-black/40 transition hover:border-cyan-100/50"
                >
                  <img
                    src={DOWNLOAD_ART_PATH}
                    alt="Cyberpunk 2020 download card"
                    className="w-full transition duration-300 group-hover:scale-[1.015]"
                  />
                </a>
                <p className="mt-4 text-sm text-white/65">
                  Plug your keyboard into the face and grab yourself a copy choombatta!
                </p>
              </section>

              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  Save and export
                </p>
                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={saveLocalSnapshot}
                    className="rounded-2xl border border-white/15 px-4 py-3 text-sm text-white transition hover:border-white/35"
                  >
                    Save on this device
                  </button>
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="rounded-2xl border border-cyan-300/35 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50 transition hover:border-cyan-100/70"
                  >
                    Export CSV ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-2xl border border-white/15 px-4 py-3 text-sm text-white transition hover:border-white/35"
                  >
                    Print / save as PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetLedger}
                    className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                  >
                    Reset starter sheet
                  </button>
                </div>
              </section>

              <section className="rounded-[2rem] border border-red-600/30 bg-black/35 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  Next expansion
                </p>
                <div className="mt-5 space-y-4">
                  {upcomingModules.map((module) => (
                    <div
                      key={module.title}
                      className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <h2 className="text-base font-semibold text-white">{module.title}</h2>
                      <p className="mt-2 text-sm text-white/65">{module.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
