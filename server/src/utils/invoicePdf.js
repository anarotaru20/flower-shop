const PDFDocument = require("pdfkit");

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} lei`;
}

function formatDate(value) {
  return new Date(value).toLocaleString("ro-RO");
}

function getUnitPrice(item) {
  return Number(item.price || 0);
}

function getOriginalUnitPrice(item) {
  return Number(item.products?.price || item.price || 0);
}

function hasItemDiscount(item) {
  return getOriginalUnitPrice(item) > getUnitPrice(item);
}

function getDiscountPercent(item) {
  const original = getOriginalUnitPrice(item);
  const current = getUnitPrice(item);

  if (!original || current >= original) return 0;

  return Math.round(((original - current) / original) * 100);
}

function getLineTotal(item) {
  return Number(item.quantity || 0) * getUnitPrice(item);
}

function getOriginalLineTotal(item) {
  return Number(item.quantity || 0) * getOriginalUnitPrice(item);
}

function drawRightAlignedTextWithStrike(doc, text, x, y, width) {
  const textWidth = doc.widthOfString(text);
  const rightEdge = x + width;
  const textX = rightEdge - textWidth;
  const lineY = y + doc.currentLineHeight() / 2;

  doc.text(text, x, y, { width, align: "right" });

  doc
    .moveTo(textX, lineY)
    .lineTo(textX + textWidth, lineY)
    .strokeColor("#9ca3af")
    .lineWidth(1)
    .stroke();
}

function drawTableHeader(doc, y) {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111111")
    .text("Produs", 50, y)
    .text("Cant.", 280, y, { width: 50, align: "center" })
    .text("Pret unitar", 340, y, { width: 90, align: "right" })
    .text("Total", 460, y, { width: 100, align: "right" });

  doc
    .moveTo(50, y + 18)
    .lineTo(560, y + 18)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .stroke();
}

function drawTableRow(doc, item, y) {
  const productName = item.product_name || item.products?.name || "-";
  const quantity = Number(item.quantity || 0);
  const unitPrice = getUnitPrice(item);
  const originalUnitPrice = getOriginalUnitPrice(item);
  const lineTotal = getLineTotal(item);
  const originalLineTotal = getOriginalLineTotal(item);
  const discounted = hasItemDiscount(item);
  const discountPercent = getDiscountPercent(item);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#111111")
    .text(productName, 50, y, {
      width: 210,
    })
    .text(String(quantity), 280, y, { width: 50, align: "center" });

  if (discounted) {
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#b85c77")
      .text(`Reducere aplicata -${discountPercent}%`, 50, y + 12, {
        width: 210,
      });

    doc.font("Helvetica").fontSize(9).fillColor("#9ca3af");
    drawRightAlignedTextWithStrike(
      doc,
      formatPrice(originalUnitPrice),
      340,
      y,
      90,
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111111")
      .text(formatPrice(unitPrice), 340, y + 14, { width: 90, align: "right" });

    doc.font("Helvetica").fontSize(9).fillColor("#9ca3af");
    drawRightAlignedTextWithStrike(
      doc,
      formatPrice(originalLineTotal),
      460,
      y,
      100,
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111111")
      .text(formatPrice(lineTotal), 460, y + 14, {
        width: 100,
        align: "right",
      });
  } else {
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#111111")
      .text(formatPrice(unitPrice), 340, y, { width: 90, align: "right" })
      .text(formatPrice(lineTotal), 460, y, { width: 100, align: "right" });
  }

  doc
    .moveTo(50, y + 34)
    .lineTo(560, y + 34)
    .strokeColor("#eeeeee")
    .lineWidth(1)
    .stroke();

  return discounted ? 42 : 34;
}

function ensurePageSpace(doc, currentY, neededHeight = 80) {
  if (currentY + neededHeight > 750) {
    doc.addPage();
    return 60;
  }
  return currentY;
}

function getOriginalSubtotal(order) {
  return (order.order_items || []).reduce((sum, item) => {
    return sum + getOriginalLineTotal(item);
  }, 0);
}

function getFinalSubtotal(order) {
  return Number(order.subtotal || 0);
}

function getDiscountAmount(order) {
  const originalSubtotal = getOriginalSubtotal(order);
  const finalSubtotal = getFinalSubtotal(order);
  return Number((originalSubtotal - finalSubtotal).toFixed(2));
}

function generateInvoicePdf(res, order) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  const filename = `factura-${order.invoice_number || order.id}.pdf`;

  const originalSubtotal = getOriginalSubtotal(order);
  const finalSubtotal = getFinalSubtotal(order);
  const taxAmount = Number(order.tax_amount || 0);
  const discountAmount = getDiscountAmount(order);
  const hasDiscount = discountAmount > 0;
  const grandTotal = Number(order.total || 0);

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
    .text("Bloomera SRL", 50, 175)
    .text("CUI: RO14785874", 50, 190)
    .text("str. Florilor, nr. 14, Bucuresti, Romania", 50, 205);

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

  let y = hasDiscount ? 276 : 270;

  drawTableHeader(doc, y);
  y += 32;

  for (const item of order.order_items || []) {
    y = ensurePageSpace(doc, y, 54);

    if (y === 60) {
      drawTableHeader(doc, y);
      y += 32;
    }

    const rowHeight = drawTableRow(doc, item, y);
    y += rowHeight;
  }

  y += 20;
  y = ensurePageSpace(doc, y, hasDiscount ? 160 : 120);

  if (hasDiscount) {
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#111827")
      .text("Subtotal initial:", 340, y, { width: 120, align: "right" })
      .text(formatPrice(originalSubtotal), 470, y, {
        width: 90,
        align: "right",
      });

    doc
      .fillColor("#dc2626")
      .text("Reducere:", 340, y + 20, { width: 120, align: "right" })
      .text(`- ${formatPrice(discountAmount)}`, 470, y + 20, {
        width: 90,
        align: "right",
      });

    doc
      .fillColor("#111827")
      .text("Subtotal redus:", 340, y + 40, { width: 120, align: "right" })
      .text(formatPrice(finalSubtotal), 470, y + 40, {
        width: 90,
        align: "right",
      });

    doc
      .text("Taxe:", 340, y + 60, { width: 120, align: "right" })
      .text(formatPrice(taxAmount), 470, y + 60, {
        width: 90,
        align: "right",
      });

    const totalLabel = "TOTAL DE PLATA:";
    const totalValue = formatPrice(grandTotal);

    doc.font("Helvetica-Bold").fontSize(16);

    const valueWidth = doc.widthOfString(totalValue);
    const labelWidth = doc.widthOfString(totalLabel);
    const gap = 12;
    const rightX = 560;
    const valueX = rightX - valueWidth;
    const labelX = valueX - gap - labelWidth;
    const lineY = y + 90;
    const textY = y + 100;

    doc
      .moveTo(labelX, lineY)
      .lineTo(rightX, lineY)
      .strokeColor("#9ca3af")
      .lineWidth(1.5)
      .stroke();

    doc
      .fillColor("#111827")
      .text(totalLabel, labelX, textY, {
        lineBreak: false,
      })
      .text(totalValue, valueX, textY, {
        lineBreak: false,
      });
  } else {
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#111827")
      .text("Subtotal:", 360, y, { width: 100, align: "right" })
      .text(formatPrice(finalSubtotal), 470, y, {
        width: 90,
        align: "right",
      });

    doc
      .text("Taxe:", 360, y + 20, { width: 100, align: "right" })
      .text(formatPrice(taxAmount), 470, y + 20, {
        width: 90,
        align: "right",
      });

    const totalLabel = "TOTAL DE PLATA:";
    const totalValue = formatPrice(grandTotal);

    doc.font("Helvetica-Bold").fontSize(16);

    const valueWidth = doc.widthOfString(totalValue);
    const labelWidth = doc.widthOfString(totalLabel);
    const gap = 12;
    const rightX = 560;
    const valueX = rightX - valueWidth;
    const labelX = valueX - gap - labelWidth;
    const lineY = y + 42;
    const textY = y + 54;

    doc
      .moveTo(labelX, lineY)
      .lineTo(rightX, lineY)
      .strokeColor("#9ca3af")
      .lineWidth(1.5)
      .stroke();

    doc
      .fillColor("#111827")
      .text(totalLabel, labelX, textY, {
        lineBreak: false,
      })
      .text(totalValue, valueX, textY, {
        lineBreak: false,
      });
  }

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
