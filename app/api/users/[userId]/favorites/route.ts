import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

// GET /api/users/[userId]/favorites - Get all favorites for a user
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();
        const { userId } = await params;

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

        const favoris = await prisma.favori.findMany({
            where: { userId },
            include: {
                produit: {
                    include: {
                        images: true,
                        categorie: { select: { id: true, nom: true } },
                        genre: { select: { id: true, nom: true } },
                        couleurs: { select: { id: true, nom: true, code: true } },
                        tailles: { select: { id: true, nom: true } },
                        produitBoutique: { select: { fournisseur: true } },
                        produitMarketplace: {
                            select: {
                                vendeur: {
                                    select: {
                                        id: true,
                                        nomBoutique: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { dateAjout: "desc" },
        });

        // Transform to expected format
        const products = favoris.map((fav) => {
            const p = fav.produit;
            return {
                id: p.id,
                type: p.produitMarketplace ? "marketplace" : "boutique",
                nom: p.nom,
                objet: p.objet,
                description: p.description,
                prix: Number(p.prix),
                qteStock: p.qteStock,
                noteMoyenne: Number(p.noteMoyenne),
                totalEvaluations: p.totalEvaluations,
                dateCreation: p.dateCreation,
                dateModification: p.dateModification,
                genre: p.genre,
                categorie: p.categorie,
                couleurs: p.couleurs,
                tailles: p.tailles,
                fournisseur: p.produitBoutique
                    ? { nom: p.produitBoutique.fournisseur }
                    : undefined,
                vendeur: p.produitMarketplace?.vendeur
                    ? {
                        id: p.produitMarketplace.vendeur.id,
                        nomBoutique: p.produitMarketplace.vendeur.nomBoutique,
                        description: p.produitMarketplace.vendeur.description,
                        imagePublicId: null,
                    }
                    : undefined,
                images: p.images,
                isFavorite: true,
            };
        });

        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        console.error("API Error [GET /api/users/[userId]/favorites]:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}

// POST /api/users/[userId]/favorites - Add a product to favorites
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();
        const { userId } = await params;

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

        const body = await req.json();
        const { produitId } = body;

        if (!produitId) {
            return NextResponse.json(
                { error: "L'ID du produit est requis." },
                { status: 400 }
            );
        }

        // Check if product exists
        const produit = await prisma.produit.findUnique({
            where: { id: produitId },
        });

        if (!produit) {
            return NextResponse.json(
                { error: "Produit introuvable." },
                { status: 404 }
            );
        }

        // Check if already in favorites
        const existingFav = await prisma.favori.findUnique({
            where: {
                userId_produitId: { userId, produitId },
            },
        });

        if (existingFav) {
            return NextResponse.json(
                { error: "Ce produit est déjà dans vos favoris." },
                { status: 409 }
            );
        }

        // Add to favorites
        const favori = await prisma.favori.create({
            data: { userId, produitId },
        });

        return NextResponse.json(
            { message: "Produit ajouté aux favoris.", data: favori },
            { status: 201 }
        );
    } catch (error) {
        console.error("API Error [POST /api/users/[userId]/favorites]:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
