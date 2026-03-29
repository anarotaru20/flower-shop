const transporter = require("../config/mailer");

function buildProductsHtml(products) {
  return products
    .map(
      (product) => `
        <li>
          <strong>${product.name}</strong> - ${product.price} lei
        </li>
      `,
    )
    .join("");
}

function getEventTypeLabel(type) {
  const map = {
    birthday: "Zi de naștere",
    anniversary: "Aniversare",
    name_day: "Onomastică",
    holiday: "Sărbătoare",
    custom: "Alt eveniment",
  };

  return map[type] || type;
}

async function sendReminderEmail({ to, event, beneficiary, products }) {
  const eventTypeLabel = getEventTypeLabel(event.event_type);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #e91e63;">Bloomera îți amintește</h2>

      <p>
        Un moment special se apropie! 💖
      </p>

      <p>
        Ai un <strong>${eventTypeLabel}</strong> pentru 
        <strong>${beneficiary?.name || "o persoană dragă"}</strong>.
      </p>

      <p>
        📅 <strong>Data evenimentului:</strong> ${event.event_date}
      </p>

      <hr style="margin: 20px 0;" />

      <h3 style="color: #4caf50;">🎁 Idei perfecte pentru acest moment</h3>

      <ul style="padding-left: 20px;">
        ${buildProductsHtml(products)}
      </ul>

      <p style="margin-top: 20px;">
        Surprinde cu ceva special și transformă ziua într-o amintire de neuitat 🌷
      </p>

      <p style="margin-top: 30px;">
        Cu drag,<br/>
        <strong>Echipa Bloomera</strong>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Bloomera" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🌸 Nu uita: ${eventTypeLabel} pentru ${beneficiary?.name || "cineva drag"}`,
    html,
  });
}

module.exports = {
  sendReminderEmail,
};
