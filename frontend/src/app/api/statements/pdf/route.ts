import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface StatementTransaction {
  txHash: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  usdValue: string | null;
  walletAddress: string;
}

interface StatementRequest {
  transactions: StatementTransaction[];
  totalIncome: string;
  startDate?: string;
  endDate?: string;
  walletCount: number;
  chain?: string;
}

export async function POST(request: Request) {
  try {
    const body: StatementRequest = await request.json();
    const { transactions, totalIncome, startDate, endDate, walletCount, chain = "ethereum" } = body;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "No transactions provided" }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper to add a page with header
    const addPageWithHeader = () => {
      const page = pdfDoc.addPage([612, 792]);
      const { width, height } = page.getSize();
      const margin = 50;
      
      // Header
      page.drawText("STATEMENT", {
        x: margin,
        y: height - margin,
        size: 24,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawText("CryptoClerks", {
        x: width - margin - 100,
        y: height - margin,
        size: 14,
        font: fontBold,
        color: rgb(0.2, 0.4, 0.8),
      });

      // Date range
      const dateStr = startDate && endDate
        ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
        : new Date().toLocaleDateString();
      
      page.drawText(dateStr, {
        x: margin,
        y: height - margin - 20,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText(`Chain: ${chain}`, {
        x: width - margin - 100,
        y: height - margin - 20,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Divider
      page.drawLine({
        start: { x: margin, y: height - margin - 30 },
        end: { x: width - margin, y: height - margin - 30 },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
      });

      return { page, width, height, margin };
    };

    // Summary page
    const summaryPage = addPageWithHeader();
    let y = summaryPage.height - summaryPage.margin - 60;

    summaryPage.page.drawText("SUMMARY", {
      x: summaryPage.margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });

    y -= 30;
    summaryPage.page.drawText(`Total Transactions: ${transactions.length}`, {
      x: summaryPage.margin,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 20;
    summaryPage.page.drawText(`Wallets: ${walletCount}`, {
      x: summaryPage.margin,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 20;
    summaryPage.page.drawText(`Total Income: $${totalIncome}`, {
      x: summaryPage.margin,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Transaction pages
    const itemsPerPage = 8;
    const pages = Math.ceil(transactions.length / itemsPerPage);

    for (let pageNum = 0; pageNum < pages; pageNum++) {
      const { page, width, height, margin } = addPageWithHeader();
      y = height - margin - 60;

      // Column headers
      const colX = {
        date: margin,
        token: margin + 80,
        amount: margin + 140,
        usd: margin + 220,
        hash: margin + 300,
      };

      page.drawText("Date", { x: colX.date, y, size: 9, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
      page.drawText("Token", { x: colX.token, y, size: 9, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
      page.drawText("Amount", { x: colX.amount, y, size: 9, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
      page.drawText("USD", { x: colX.usd, y, size: 9, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
      page.drawText("Tx Hash", { x: colX.hash, y, size: 9, font: fontBold, color: rgb(0.5, 0.5, 0.5) });

      y -= 15;
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 0.5,
        color: rgb(0.85, 0.85, 0.85),
      });
      y -= 15;

      const start = pageNum * itemsPerPage;
      const end = Math.min(start + itemsPerPage, transactions.length);
      const pageTxs = transactions.slice(start, end);

      for (const tx of pageTxs) {
        page.drawText(new Date(tx.date).toLocaleDateString(), {
          x: colX.date, y, size: 8, font, color: rgb(0.2, 0.2, 0.2),
        });
        page.drawText(tx.token, {
          x: colX.token, y, size: 8, font, color: rgb(0.2, 0.2, 0.2),
        });
        page.drawText(tx.amount, {
          x: colX.amount, y, size: 8, font, color: rgb(0.2, 0.2, 0.2),
        });
        page.drawText(tx.usdValue || "—", {
          x: colX.usd, y, size: 8, font, color: rgb(0.2, 0.2, 0.2),
        });
        page.drawText(tx.txHash.slice(0, 16) + "...", {
          x: colX.hash, y, size: 7, font: font, color: rgb(0.4, 0.4, 0.4),
        });
        y -= 18;
      }

      // Page number
      page.drawText(`Page ${pageNum + 1} of ${pages}`, {
        x: width / 2 - 30,
        y: margin - 10,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Footer on all pages
    const pdfPages = pdfDoc.getPages();
    for (const page of pdfPages) {
      page.drawLine({
        start: { x: 50, y: 40 },
        end: { x: 562, y: 40 },
        thickness: 0.5,
        color: rgb(0.85, 0.85, 0.85),
      });
      page.drawText("Generated by CryptoClerks — crypto-clerk.onrender.com", {
        x: 50,
        y: 25,
        size: 7,
        font,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="statement-${chain}-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Statement PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
