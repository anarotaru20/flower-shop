const transporter = require("../config/mailer");

function buildProductsHtml(products) {
  return products
    .map(
      (product) => `
        <li>
          <strong>${product.name}</strong> - ${product.price} RON
        </li>
      `,
    )
    .join("");
}

async function sendReminderEmail({ to, event, beneficiary, products }) {
  const html = `
    <h2>Bloomera Reminder</h2>
    <p>You have an upcoming <strong>${event.event_type}</strong> for <strong>${beneficiary?.name || "someone special"}</strong>.</p>
    <p><strong>Date:</strong> ${event.event_date}</p>

    <h3>Recommended products</h3>
    <ul>
      ${buildProductsHtml(products)}
    </ul>
  `;

  await transporter.sendMail({
    from: `"Bloomera" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Reminder: ${event.event_type} for ${beneficiary?.name || "your beneficiary"}`,
    html,
  });
}

module.exports = {
  sendReminderEmail,
};