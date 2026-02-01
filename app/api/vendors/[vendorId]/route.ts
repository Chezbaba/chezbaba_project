import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

// GET vendor details by ID (Public route)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ vendorId: string }> }
) {
    const { vendorId } = await params;

    try {
        // Fetch the vendor with related user info
        const vendeur = await prisma.vendeur.findUnique({
            where: { id: vendorId },
            select: {
                id: true,
                nomBoutique: true,
                description: true,
                client: {
                    select: {
                        user: {
                            select: {
                                nom: true,
                                prenom: true,
                                imagePublicId: true,
                                dateCreation: true,
                            },
                        },
                    },
                },
                produitMarketplace: {
                    select: {
                        produit: {
                            select: {
                                noteMoyenne: true,
                                totalEvaluations: true,
                            },
                        },
                    },
                },
            },
        });

        if (!vendeur) {
            return NextResponse.json(
                { error: "Boutique introuvable." },
                { status: 404 }
            );
        }

        // Calculate total products count
        const totalProduits = vendeur.produitMarketplace.length;

        // Calculate average rating across all products
        const produitsAvecNotes = vendeur.produitMarketplace.filter(
            (pm) => pm.produit.totalEvaluations > 0
        );
        const sommeNotes = produitsAvecNotes.reduce(
            (sum, pm) => sum + Number(pm.produit.noteMoyenne),
            0
        );
        const noteMoyenne =
            produitsAvecNotes.length > 0 ? sommeNotes / produitsAvecNotes.length : 0;

        // Calculate total reviews count
        const totalAvis = vendeur.produitMarketplace.reduce(
            (sum, pm) => sum + pm.produit.totalEvaluations,
            0
        );

        const data = {
            id: vendeur.id,
            nomBoutique: vendeur.nomBoutique,
            description: vendeur.description,
            imagePublicId: vendeur.client.user.imagePublicId,
            proprietaire: {
                nom: vendeur.client.user.nom,
                prenom: vendeur.client.user.prenom,
            },
            dateCreation: vendeur.client.user.dateCreation,
            stats: {
                totalProduits,
                noteMoyenne: Number(noteMoyenne.toFixed(1)),
                totalAvis,
            },
        };

        return NextResponse.json(
            { message: "Boutique récupérée avec succès", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [GET /api/vendors/[vendorId]]:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
