export function getEventsForTodayReminder(events) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return events.filter(event => {
    if (!event.event_date) return false

    const eventDate = new Date(event.event_date)
    const reminderDays = event.reminder_days_before ?? 4

    const reminderDate = new Date(eventDate)
    reminderDate.setDate(reminderDate.getDate() - reminderDays)
    reminderDate.setHours(0, 0, 0, 0)

    return reminderDate.getTime() === today.getTime()
  })
}