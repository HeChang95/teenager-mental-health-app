export function initDataTable(selector, options = {}) {
  if (typeof window === 'undefined' || !window.DataTable) return null

  const existing = window.DataTable.instances?.get?.(selector)
  if (existing?.destroy) existing.destroy()
  const dt = new window.DataTable(selector, { pageLength: 10, order: [], ...options })

  const ths = document.querySelectorAll(`${selector} thead th`)
  ths.forEach((th, idx) => {
    const input = th.querySelector('input')
    if (!input) return
    input.addEventListener('keyup', () => dt.column(idx).search(input.value).draw())
  })
  return dt
}
