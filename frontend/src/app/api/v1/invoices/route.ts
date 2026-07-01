import { NextRequest, NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const invoiceSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email().optional(),
  amount: z.string().min(1),
  token: z.string().min(1),
  dueDate: z.string().optional(),
});

export const POST = apiAuthMiddleware(async (request: NextRequest, userId?: string) => {
  try {
    const body = await request.json();
    const validated = invoiceSchema.parse(body);

    const count = await prisma.invoice.count();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const number = (count + 1).toString().padStart(4, "0");
    const invoiceNumber = `INV-${year}${month}${day}-${number}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientName: validated.clientName,
        clientEmail: validated.clientEmail,
        amount: validated.amount,
        token: validated.token,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        paymentTxHash: null,
        pdfUrl: null,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("API invoice create error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
});

export const GET = apiAuthMiddleware(async (request: NextRequest, userId?: string) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    console.error("API invoice list error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
});
