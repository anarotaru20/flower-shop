const PDFDocument = require("pdfkit");

function formatPrice(value) {
  return `${Number(value).toFixed(2)} lei`;
}

function formatDate(value) {
  return new Date(value).toLocaleString("ro-RO");
}

function drawTableHeader(doc, y) {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Produs", 50, y)
    .text("Cant.", 300, y, { width: 60, align: "center" })
    .text("Pret unitar", 370, y, { width: 90, align: "right" })
    .text("Valoare", 470, y, { width: 90, align: "right" });

  doc
    .moveTo(50, y + 18)
    .lineTo(560, y + 18)
    .strokeColor("#cccccc")
    .stroke();
}

function drawTableRow(doc, item, y) {
  const lineTotal = Number(item.quantity) * Number(item.price);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#111111")
    .text(item.product_name || item.products?.name || "-", 50, y, {
      width: 220,
    })
    .text(String(item.quantity), 300, y, { width: 60, align: "center" })
    .text(formatPrice(item.price), 370, y, { width: 90, align: "right" })
    .text(formatPrice(lineTotal), 470, y, { width: 90, align: "right" });

  doc
    .moveTo(50, y + 22)
    .lineTo(560, y + 22)
    .strokeColor("#eeeeee")
    .stroke();
}

function ensurePageSpace(doc, currentY, neededHeight = 80) {
  if (currentY + neededHeight > 750) {
    doc.addPage();
    return 60;
  }
  return currentY;
}

function generateInvoicePdf(res, order) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  const filename = `factura-${order.invoice_number || order.id}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

  doc.pipe(res);

  const titleY = 45;

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#1f2937")
    .text("FACTURA", 50, titleY);

  if (order.status === "cancelled") {
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("red")
      .text("ANULATA", 50, titleY, {
        width: 500,
        align: "right",
      });
  }

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#4b5563")
    .text(`Serie/Numar: ${order.invoice_number || "-"}`, 50, 80)
    .text(`Data emiterii: ${formatDate(order.created_at)}`, 50, 97)
    .text(`Status plata: ${order.payment_status || "-"}`, 50, 114);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text("Furnizor", 50, 155);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text("Bloomera", 50, 175)
    .text("Magazin online de flori si plante", 50, 190)
    .text("Romania", 50, 205);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text("Client", 330, 155);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(`Nume: ${order.customer_name || "-"}`, 330, 175, { width: 230 })
    .text(`Telefon: ${order.phone || "-"}`, 330, 190, { width: 230 })
    .text(`Adresa: ${order.shipping_address || "-"}`, 330, 205, { width: 230 });

  let y = 270;

  drawTableHeader(doc, y);
  y += 32;

  for (const item of order.order_items || []) {
    y = ensurePageSpace(doc, y, 40);

    if (y === 60) {
      drawTableHeader(doc, y);
      y += 32;
    }

    drawTableRow(doc, item, y);
    y += 30;
  }

  y += 20;
  y = ensurePageSpace(doc, y, 120);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#111827")
    .text("Subtotal:", 360, y, { width: 100, align: "right" })
    .text(formatPrice(order.subtotal || 0), 470, y, {
      width: 90,
      align: "right",
    });

  doc
    .text("Taxe:", 360, y + 20, { width: 100, align: "right" })
    .text(formatPrice(order.tax_amount || 0), 470, y + 20, {
      width: 90,
      align: "right",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Total:", 360, y + 45, { width: 100, align: "right" })
    .text(formatPrice(order.total || 0), 470, y + 45, {
      width: 90,
      align: "right",
    });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6b7280")
    .text("Factura generata automat de sistemul Bloomera.", 50, 770, {
      align: "center",
      width: 510,
    });

  doc.end();
}

module.exports = {
  generateInvoicePdf,
};
