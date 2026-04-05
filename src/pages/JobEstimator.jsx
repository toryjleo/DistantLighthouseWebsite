import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'distant-lighthouse-job-estimator'

const createLineItem = (overrides = {}) => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: '1',
  unit: 'ea',
  unitPrice: '0',
  ...overrides,
})

const defaultEstimate = {
  companyName: 'Distant Lighthouse Contracting Sample',
  estimatorName: '',
  estimateNumber: 'EST-1001',
  customerName: '',
  customerCompany: '',
  customerEmail: '',
  customerPhone: '',
  jobName: '',
  jobLocation: '',
  estimateDate: new Date().toISOString().slice(0, 10),
  validUntil: '',
  taxRate: '5.5',
  markupRate: '12',
  notes:
    'Scope includes listed materials and labor only. Unforeseen conditions or extra work should be approved before proceeding.',
  lineItems: [
    createLineItem({
      description: 'Service call and site inspection',
      quantity: '1',
      unit: 'job',
      unitPrice: '125',
    }),
    createLineItem({
      description: 'Repair labor',
      quantity: '3',
      unit: 'hr',
      unitPrice: '95',
    }),
    createLineItem({
      description: 'Miscellaneous materials',
      quantity: '1',
      unit: 'lot',
      unitPrice: '85',
    }),
  ],
}

const csvColumns = [
  'Estimate Number',
  'Estimate Date',
  'Valid Until',
  'Company Name',
  'Estimator Name',
  'Customer Name',
  'Customer Company',
  'Customer Email',
  'Customer Phone',
  'Job Name',
  'Job Location',
  'Tax Rate',
  'Markup Rate',
  'Notes',
  'Line Description',
  'Quantity',
  'Unit',
  'Unit Price',
  'Line Total',
]

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(value) ? value : 0)

const parseNumber = (value) => {
  const parsed = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}

const calculateLineTotal = (lineItem) =>
  parseNumber(lineItem.quantity) * parseNumber(lineItem.unitPrice)

const buildCsv = (estimate, totals) => {
  const rows = estimate.lineItems.map((item) => [
    estimate.estimateNumber,
    estimate.estimateDate,
    estimate.validUntil,
    estimate.companyName,
    estimate.estimatorName,
    estimate.customerName,
    estimate.customerCompany,
    estimate.customerEmail,
    estimate.customerPhone,
    estimate.jobName,
    estimate.jobLocation,
    estimate.taxRate,
    estimate.markupRate,
    estimate.notes.replace(/\r?\n/g, ' '),
    item.description,
    item.quantity,
    item.unit,
    item.unitPrice,
    calculateLineTotal(item).toFixed(2),
  ])

  rows.push([])
  rows.push(['Summary'])
  rows.push(['Subtotal', totals.subtotal.toFixed(2)])
  rows.push(['Markup', totals.markup.toFixed(2)])
  rows.push(['Taxable Subtotal', totals.taxableSubtotal.toFixed(2)])
  rows.push(['Tax', totals.tax.toFixed(2)])
  rows.push(['Grand Total', totals.total.toFixed(2)])

  return [csvColumns, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')
}

const parseCsvLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      index += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

const parseEstimateCsv = (text) => {
  const rows = text
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseCsvLine)

  if (rows.length < 2) {
    throw new Error('The CSV file does not contain estimate rows yet.')
  }

  const header = rows[0]
  if (header.join('|') !== csvColumns.join('|')) {
    throw new Error('This CSV format does not match the estimator export.')
  }

  const dataRows = rows
    .slice(1)
    .filter((row) => row.length === csvColumns.length && row[14])

  if (dataRows.length === 0) {
    throw new Error('No line items were found in the CSV file.')
  }

  const first = dataRows[0]

  return {
    companyName: first[3] ?? '',
    estimatorName: first[4] ?? '',
    estimateNumber: first[0] ?? '',
    customerName: first[5] ?? '',
    customerCompany: first[6] ?? '',
    customerEmail: first[7] ?? '',
    customerPhone: first[8] ?? '',
    jobName: first[9] ?? '',
    jobLocation: first[10] ?? '',
    estimateDate: first[1] ?? '',
    validUntil: first[2] ?? '',
    taxRate: first[11] ?? '0',
    markupRate: first[12] ?? '0',
    notes: first[13] ?? '',
    lineItems: dataRows.map((row) =>
      createLineItem({
        description: row[14] ?? '',
        quantity: row[15] ?? '0',
        unit: row[16] ?? 'ea',
        unitPrice: row[17] ?? '0',
      }),
    ),
  }
}

const fieldGroups = [
  {
    title: 'Estimate',
    fields: [
      { name: 'companyName', label: 'Company name' },
      { name: 'estimatorName', label: 'Prepared by' },
      { name: 'estimateNumber', label: 'Estimate number' },
      { name: 'estimateDate', label: 'Estimate date', type: 'date' },
      { name: 'validUntil', label: 'Valid until', type: 'date' },
    ],
  },
  {
    title: 'Customer',
    fields: [
      { name: 'customerName', label: 'Customer name' },
      { name: 'customerCompany', label: 'Company / property' },
      { name: 'customerEmail', label: 'Email', type: 'email' },
      { name: 'customerPhone', label: 'Phone' },
      { name: 'jobName', label: 'Job name' },
      { name: 'jobLocation', label: 'Job location' },
    ],
  },
]

export default function JobEstimator() {
  const fileInputRef = useRef(null)
  const [estimate, setEstimate] = useState(defaultEstimate)
  const [saveMessage, setSaveMessage] = useState('Autosaves on this device.')

  useEffect(() => {
    const savedEstimate = window.localStorage.getItem(STORAGE_KEY)
    if (!savedEstimate) return

    try {
      const parsed = JSON.parse(savedEstimate)
      setEstimate({
        ...defaultEstimate,
        ...parsed,
        lineItems: Array.isArray(parsed.lineItems) && parsed.lineItems.length > 0
          ? parsed.lineItems.map((item) => createLineItem(item))
          : defaultEstimate.lineItems,
      })
      setSaveMessage('Loaded your last saved estimate from this device.')
    } catch {
      setSaveMessage('Saved data was unreadable, so the sample estimate stayed loaded.')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estimate))
  }, [estimate])

  const totals = useMemo(() => {
    const subtotal = estimate.lineItems.reduce(
      (sum, item) => sum + calculateLineTotal(item),
      0,
    )
    const markup = subtotal * (parseNumber(estimate.markupRate) / 100)
    const taxableSubtotal = subtotal + markup
    const tax = taxableSubtotal * (parseNumber(estimate.taxRate) / 100)
    const total = taxableSubtotal + tax

    return {
      subtotal,
      markup,
      taxableSubtotal,
      tax,
      total,
    }
  }, [estimate])

  const updateEstimateField = (name, value) => {
    setEstimate((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const updateLineItem = (id, field, value) => {
    setEstimate((current) => ({
      ...current,
      lineItems: current.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addLineItem = () => {
    setEstimate((current) => ({
      ...current,
      lineItems: [...current.lineItems, createLineItem()],
    }))
  }

  const removeLineItem = (id) => {
    setEstimate((current) => ({
      ...current,
      lineItems:
        current.lineItems.length === 1
          ? current.lineItems
          : current.lineItems.filter((item) => item.id !== id),
    }))
  }

  const saveLocalSnapshot = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estimate))
    setSaveMessage(`Saved to this device at ${new Date().toLocaleTimeString()}.`)
  }

  const exportCsv = () => {
    const csv = buildCsv(estimate, totals)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${estimate.estimateNumber || 'job-estimate'}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setSaveMessage('CSV exported for Excel, Numbers, or Google Sheets.')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedEstimate = parseEstimateCsv(text)
      setEstimate(importedEstimate)
      setSaveMessage(`Imported ${file.name}.`)
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : 'Import failed for that CSV file.',
      )
    } finally {
      event.target.value = ''
    }
  }

  const resetEstimate = () => {
    setEstimate({
      ...defaultEstimate,
      estimateNumber: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      estimateDate: new Date().toISOString().slice(0, 10),
    })
    setSaveMessage('Loaded a fresh sample estimate.')
  }

  return (
    <motion.section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/45">
            Project sample
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Job estimator built for contractors.
          </h1>
          <p className="text-sm text-white/70 sm:text-base lg:text-lg">
            Save on the device, export to CSV for spreadsheets, and import the same
            file later on another machine. That keeps it friendly for Windows,
            macOS, Android, Excel, Numbers, and Google Sheets.
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 lg:max-w-sm">
          {saveMessage}
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {fieldGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-6"
            >
              <h2 className="text-lg font-semibold text-white">{group.title}</h2>
              <div className="mt-5 grid gap-4">
                {group.fields.map((field) => (
                  <label key={field.name} className="space-y-2 text-sm text-white/70">
                    <span>{field.label}</span>
                    <input
                      type={field.type ?? 'text'}
                      value={estimate[field.name]}
                      onChange={(event) =>
                        updateEstimateField(field.name, event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Line items</h2>
              <p className="text-sm text-white/55">
                Labor, materials, travel, or flat-rate work.
              </p>
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="rounded-full border border-emerald-300/40 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-100 transition hover:border-emerald-200"
            >
              Add item
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="hidden grid-cols-[minmax(0,3fr)_minmax(100px,1fr)_minmax(90px,0.8fr)_minmax(130px,1fr)_minmax(130px,1fr)_110px] gap-4 px-3 text-left text-xs uppercase tracking-[0.24em] text-white/40 xl:grid">
              <div>Description</div>
              <div>Qty</div>
              <div>Unit</div>
              <div>Unit price</div>
              <div>Total</div>
              <div>Remove</div>
            </div>

            {estimate.lineItems.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="mb-4 flex items-center justify-between xl:hidden">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/40">
                    Item {index + 1}
                  </div>
                  <div className="text-sm font-medium text-white/75">
                    {formatCurrency(calculateLineTotal(item))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,3fr)_minmax(100px,1fr)_minmax(90px,0.8fr)_minmax(130px,1fr)_minmax(130px,1fr)_110px] xl:items-end">
                  <label className="space-y-2 text-sm text-white/70">
                    <span>Description</span>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(event) =>
                        updateLineItem(item.id, 'description', event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-white/70">
                    <span>Qty</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(event) =>
                        updateLineItem(item.id, 'quantity', event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-white/70">
                    <span>Unit</span>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(event) =>
                        updateLineItem(item.id, 'unit', event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-white/70">
                    <span>Unit price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) =>
                        updateLineItem(item.id, 'unitPrice', event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                    />
                  </label>

                  <div className="space-y-2 text-sm text-white/70">
                    <span className="block">Total</span>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
                      {formatCurrency(calculateLineTotal(item))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-sm text-white/70 xl:invisible">
                      Remove
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      disabled={estimate.lineItems.length === 1}
                      className="w-full rounded-2xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
              <label className="space-y-2 text-sm text-white/70">
                <span>Notes / scope language</span>
                <textarea
                  rows="6"
                  value={estimate.notes}
                  onChange={(event) => updateEstimateField('notes', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                />
              </label>
              <label className="space-y-2 text-sm text-white/70">
                <span>Markup %</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estimate.markupRate}
                  onChange={(event) => updateEstimateField('markupRate', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                />
              </label>
              <label className="space-y-2 text-sm text-white/70">
                <span>Tax %</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estimate.taxRate}
                  onChange={(event) => updateEstimateField('taxRate', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
                />
              </label>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/8 to-white/4 p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">
              Estimate totals
            </p>
            <div className="mt-6 space-y-4 text-sm text-white/75">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Markup</span>
                <span>{formatCurrency(totals.markup)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxable subtotal</span>
                <span>{formatCurrency(totals.taxableSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
                <span>Grand total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
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
                  className="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 transition hover:border-emerald-200"
                >
                  Export CSV spreadsheet
                </button>
                <button
                  type="button"
                  onClick={handleImportClick}
                  className="rounded-2xl border border-white/15 px-4 py-3 text-sm text-white transition hover:border-white/35"
                >
                  Import estimator CSV
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
                  onClick={resetEstimate}
                  className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  Reset sample
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleImportChange}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 sm:p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                Why CSV
              </p>
              <div className="mt-4 space-y-3">
                <p>Contractors can open it in Excel on Windows, Numbers on Mac, or Google Sheets on a phone.</p>
                <p>It is lightweight, portable, and easy to email to an office manager or bookkeeper.</p>
                <p>The browser version stays fast, and the same UI can still become a desktop app later.</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </motion.section>
  )
}
