import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const walletSchema = z.object({
  address: z.string().min(1),
  chain: z.string().min(1),
  label: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = walletSchema.parse(body);

    // For now, no auth — create wallet without userId
    // TODO: Link to authenticated user when auth is implemented
    const wallet = await prisma.wallet.create({
      data: {
        address: validated.address,
        chain: validated.chain,
        label: validated.label,
        userId: "dev-user", // Placeholder until auth
      },
    });

    return NextResponse.json({ success: true, wallet });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Wallet creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // TODO: Filter by authenticated user
    const wallets = await prisma.wallet.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ wallets });
  } catch (error) {
    console.error("Wallet fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Wallet ID required" }, { status: 400 });
    }

    await prisma.wallet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wallet deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
