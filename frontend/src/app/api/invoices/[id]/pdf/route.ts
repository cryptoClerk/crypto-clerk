import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    let y = height - margin;

    // Header
    page.drawText("INVOICE", {
      x: margin,
      y,
      size: 32,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Business name if available
    if (invoice.user?.businessName) {
      y -= 18;
      page.drawText(invoice.user.businessName, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    y -= 20;
    page.drawText(invoice.invoiceNumber, {
      x: margin,
      y,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Status badge
    const statusColors: Record<string, [number, number, number]> = {
      paid: [0.2, 0.7, 0.3],
      pending: [0.9, 0.7, 0.1],
      overdue: [0.9, 0.2, 0.2],
      cancelled: [0.5, 0.5, 0.5],
    };
    const statusColor = statusColors[invoice.status] || [0.5, 0.5, 0.5];

    page.drawText(invoice.status.toUpperCase(), {
      x: width - margin - 80,
      y: y + 10,
      size: 10,
      font: fontBold,
      color: rgb(statusColor[0], statusColor[1], statusColor[2]),
    });

    // Divider
    y -= 30;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    // From / To
    y -= 40;
    page.drawText("BILL TO", {
      x: margin,
      y,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });

    y -= 18;
    page.drawText(invoice.clientName, {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    if (invoice.clientEmail) {
      y -= 16;
      page.drawText(invoice.clientEmail, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    // Invoice details (right side)
    const rightX = width - margin - 150;
    let detailY = y + 34;

    page.drawText("DATE", {
      x: rightX,
      y: detailY,
      size: 9,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });
    detailY -= 14;
    page.drawText(new Date(invoice.createdAt).toLocaleDateString(), {
      x: rightX,
      y: detailY,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    detailY -= 22;
    page.drawText("DUE DATE", {
      x: rightX,
      y: detailY,
      size: 9,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });
    detailY -= 14;
    page.drawText(
      invoice.dueDate
        ? new Date(invoice.dueDate).toLocaleDateString()
        : "On receipt",
      {
        x: rightX,
        y: detailY,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      }
    );

    detailY -= 22;
    page.drawText("TOKEN", {
      x: rightX,
      y: detailY,
      size: 9,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });
    detailY -= 14;
    page.drawText(invoice.token, {
      x: rightX,
      y: detailY,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Amount section
    y -= 80;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 40;
    page.drawText("TOTAL AMOUNT", {
      x: margin,
      y,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });

    y -= 28;
    page.drawText(`${invoice.amount} ${invoice.token}`, {
      x: margin,
      y,
      size: 28,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Payment status
    y -= 40;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 30;
    page.drawText("PAYMENT STATUS", {
      x: margin,
      y,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });

    y -= 18;
    page.drawText(
      invoice.status === "paid"
        ? `PAID — ${invoice.paymentTxHash ? invoice.paymentTxHash.slice(0, 20) + "..." : ""}`
        : `PENDING — Payment of ${invoice.amount} ${invoice.token} has not been received yet.`,
      {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.3, 0.3, 0.3),
      }
    );

    // Payment instructions if pending
    if (invoice.status === "pending") {
      y -= 40;
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
      });

      y -= 30;
      page.drawText("PAYMENT INSTRUCTIONS", {
        x: margin,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.5, 0.5, 0.5),
      });

      y -= 18;
      page.drawText(
        "Please send the exact amount to the wallet address provided by the invoice sender.",
        {
          x: margin,
          y,
          size: 10,
          font,
          color: rgb(0.3, 0.3, 0.3),
        }
      );
    }

    // Footer
    page.drawLine({
      start: { x: margin, y: margin + 20 },
      end: { x: width - margin, y: margin + 20 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText("Generated by CryptoClerks — crypto-clerk.onrender.com", {
      x: margin,
      y: margin,
      size: 8,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
