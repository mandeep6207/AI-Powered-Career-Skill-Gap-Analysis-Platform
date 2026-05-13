// Utility function to export data as CSV
export function exportAsCSV(data, filename = 'export.csv') {
  const headers = Object.keys(data[0] || {})
  
  // Build CSV rows
  let csv = headers.join(',') + '\n'
  
  data.forEach(row => {
    const values = headers.map(h => {
      const val = row[h]
      // Escape values containing commas or quotes
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    })
    csv += values.join(',') + '\n'
  })

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export function formatHistoryForCSV(history) {
  return history.map(h => ({
    date: h.date,
    target_role: h.target_role,
    match_score: h.match_score,
    missing_skills: h.missing_skills
  }))
}
