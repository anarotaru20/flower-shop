export function getEventsForTodayReminder(events) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function parseLocalDate(value) {
    if (!value) return null

    if (value instanceof Date) {
      const d = new Date(value)
      d.setHours(0, 0, 0, 0)
      return d
    }

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number)
      return new Date(year, month - 1, day)
    }

    const d = new Date(value)
    d.setHours(0, 0, 0, 0)
    return d
  }

  return events.filter((event) => {
    if (!event.event_date) return false

    const eventDate = parseLocalDate(event.event_date)
    if (!eventDate || Number.isNaN(eventDate.getTime())) return false

    const reminderDays = Number(event.reminder_days_before ?? 4)

    const reminderDate = new Date(eventDate)
    reminderDate.setDate(reminderDate.getDate() - reminderDays)
    reminderDate.setHours(0, 0, 0, 0)

    return reminderDate.getTime() === today.getTime()
  })
}