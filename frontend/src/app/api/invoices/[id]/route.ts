import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logError } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { receipts: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    logError(error, "Invoice fetch");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  status: z.enum(["pending", "partial", "paid", "overpaid", "overdue", "cancelled"]).optional(),
  paymentTxHash: z.string().optional(),
  paidAmount: z.string().optional(),
  remainingAmount: z.string().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateSchema.parse(body);

    const updateData: any = {};
    if (validated.status) updateData.status = validated.status;
    if (validated.paymentTxHash) {
      updateData.paymentTxHash = validated.paymentTxHash;
    }
    if (validated.paidAmount !== undefined) updateData.paidAmount = validated.paidAmount;
    if (validated.remainingAmount !== undefined) updateData.remainingAmount = validated.remainingAmount;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    logError(error, "Invoice update");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError(error, "Invoice delete");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
