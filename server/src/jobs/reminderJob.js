const { getEventsForTodayReminder } = require("../utils/reminders");
const { getAllEventsWithBeneficiaries } = require("../repo/events");
const { getAllProducts } = require("../repo/products");
const { getTopRecommendedProducts } = require("../utils/recommendations");
const { sendReminderEmail } = require("../utils/sendReminderEmail");

async function runReminderJob() {
  try {
    const events = await getAllEventsWithBeneficiaries();
    const eventsToNotify = getEventsForTodayReminder(events);
    const products = await getAllProducts();

    for (const event of eventsToNotify) {
      const beneficiary = event.beneficiaries || null;
      const recommendations = getTopRecommendedProducts(
        products,
        beneficiary,
        5,
      );

      await sendReminderEmail({
        to: event.profiles?.email,
        event,
        beneficiary,
        products: recommendations,
      });
    }
  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
}

module.exports = {
  runReminderJob,
};
