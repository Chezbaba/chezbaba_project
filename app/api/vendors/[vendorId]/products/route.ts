import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { getPaginationParams, getSortingProductsParams } from "@/lib/utils/params";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";

// GET products by vendor ID (Public route)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ vendorId: string }> }
) {
    const { vendorId } = await params;
    const { page, pageSize, skip } = getPaginationParams(req);
    const { sortBy, sortOrder } = getSortingProductsParams(req);

    try {
        // Check if the vendor exists
        const vendeurExists = await prisma.vendeur.findUnique({
            where: { id: vendorId },
            select: { id: true },
        });

        if (!vendeurExists) {
            return NextResponse.json(
                { error: "Boutique introuvable." },
                { status: 404 }
            );
        }

        // Fetch products count for this vendor
        const totalProducts = await prisma.produit.count({
            where: {
                produitMarketplace: {
                    vendeurId: vendorId,
                },
            },
        });

        // Fetch products for this vendor
        const products = await prisma.produit.findMany({
            where: {
                produitMarketplace: {
                    vendeurId: vendorId,
                },
            },
            select: getProductSelect(),
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: pageSize,
        });

        // Format products
        const data = products.map((product) => formatProductData(product));

        // Pagination response
        const pagination = {
            totalItems: totalProducts,
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: page,
            pageSize,
        };

        return NextResponse.json(
            {
                message: "Produits de la boutique récupérés avec succès",
                pagination,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [GET /api/vendors/[vendorId]/products]:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
