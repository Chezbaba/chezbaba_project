import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const categories = await prisma.categorie.findMany({
            where: {
                parentId: null, // Fetch roots
            },
            include: {
                sousCategories: true, // Fetch direct children
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
