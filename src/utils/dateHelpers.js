export function getWeekId(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date.setDate(diff))
  return monday.toISOString().split('T')[0]
}

export function getCurrentWeekId() {
  return getWeekId(new Date().toISOString().split('T')[0])
}

export function getLastWeekId() {
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return getWeekId(lastWeek.toISOString().split('T')[0])
}

export function getDayLabel(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}

export function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date.toISOString().split('T')[0])
  }
  return days
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isInWeek(dateStr, weekId) {
  return getWeekId(dateStr) === weekId
}
