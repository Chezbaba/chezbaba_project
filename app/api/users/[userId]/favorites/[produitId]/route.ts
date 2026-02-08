import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

// GET /api/users/[userId]/favorites/[produitId] - Check if product is in favorites
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string; produitId: string }> }
) {
    try {
        const session = await auth();
        const { userId, produitId } = await params;

        if (!session) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED },
                { status: 401 }
            );
        }

        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.FORBIDDEN },
                { status: 403 }
            );
        }

        const favori = await prisma.favori.findUnique({
            where: {
                userId_produitId: { userId, produitId },
            },
        });

        return NextResponse.json(
            { data: { isFavorite: !!favori } },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "API Error [GET /api/users/[userId]/favorites/[produitId]]:",
            error
        );
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[userId]/favorites/[produitId] - Remove product from favorites
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string; produitId: string }> }
) {
    try {
        const session = await auth();
        const { userId, produitId } = await params;

        if (!session) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED },
                { status: 401 }
            );
        }

        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.FORBIDDEN },
                { status: 403 }
            );
        }

        // Check if favorite exists
        const favori = await prisma.favori.findUnique({
            where: {
                userId_produitId: { userId, produitId },
            },
        });

        if (!favori) {
            return NextResponse.json(
                { error: "Ce produit n'est pas dans vos favoris." },
                { status: 404 }
            );
        }

        // Delete the favorite
        await prisma.favori.delete({
            where: { id: favori.id },
        });

        return NextResponse.json(
            { message: "Produit retiré des favoris." },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "API Error [DELETE /api/users/[userId]/favorites/[produitId]]:",
            error
        );
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
