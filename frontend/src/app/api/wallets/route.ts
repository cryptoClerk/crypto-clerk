import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Ethereum address validation regex
const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

const walletSchema = z.object({
  address: z.string().min(1).refine(isValidAddress, {
    message: "Invalid Ethereum address format. Must be 0x followed by 40 hex characters.",
  }),
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
        address: validated.address.toLowerCase(), // Normalize to lowercase
        chain: validated.chain,
        label: validated.label,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const skip = (page - 1) * limit;
    
    const totalCount = await prisma.wallet.count();
    
    const wallets = await prisma.wallet.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
    
    return NextResponse.json({ 
      wallets,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + wallets.length < totalCount,
      }
    });
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
