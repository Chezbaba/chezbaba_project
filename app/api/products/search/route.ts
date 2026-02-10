import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/utils/prisma";
import { containsFilter } from "@/lib/utils";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingProductsParams,
} from "@/lib/utils/params";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, pageSize, skip } = getPaginationParams(req);
  const { sortBy, sortOrder } = getSortingProductsParams(req);

  // Extract search params
  // Extract search params (support multi-select via comma separation)
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type");

  const rawGender = searchParams.get("gender");
  const genderList = rawGender ? rawGender.split(",") : [];

  const rawCategory = searchParams.get("category");
  const categoryList = rawCategory ? rawCategory.split(",") : [];

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const rawSize = searchParams.get("size");
  const sizeList = rawSize ? rawSize.split(",") : [];

  const rawShoeSize = searchParams.get("shoeSize");
  const shoeSizeList = rawShoeSize ? rawShoeSize.split(",") : [];

  const rawColor = searchParams.get("color");
  const colorList = rawColor ? rawColor.split(",") : [];

  const minRating = searchParams.get("minRating");
  const promo = searchParams.get("promo");

  // where conditions
  const whereClause: Prisma.ProduitWhereInput = {
    OR: [
      { nom: containsFilter(query) },
      { description: containsFilter(query) },
      { couleurs: { some: { nom: containsFilter(query) } } },
      { tailles: { some: { nom: containsFilter(query) } } },
    ],
  };

  if (type === "boutique") whereClause.produitBoutique = { isNot: null };
  if (type === "marketplace") whereClause.produitMarketplace = { isNot: null };

  if (genderList.length > 0) {
    whereClause.genre = { nom: { in: genderList } };
  }

  if (categoryList.length > 0) {
    // Also include subcategories if parent is selected (requires more complex logic or frontend to send all IDs/Names)
    // For now, simple multi-select on name
    whereClause.categorie = {
      OR: [
        { nom: { in: categoryList } },
        { parent: { nom: { in: categoryList } } } // Include children of selected parents
      ]
    };
  }

  if (sizeList.length > 0) {
    whereClause.tailles = { some: { nom: { in: sizeList } } };
  }

  if (shoeSizeList.length > 0) {
    // If both size and shoeSize are provided, combine them with OR
    if (sizeList.length > 0) {
      whereClause.tailles = {
        some: {
          OR: [
            { nom: { in: sizeList } },
            { nom: { in: shoeSizeList } }
          ]
        }
      };
    } else {
      whereClause.tailles = { some: { nom: { in: shoeSizeList } } };
    }
  }

  if (colorList.length > 0) {
    whereClause.couleurs = { some: { nom: { in: colorList } } };
  }

  if (minPrice || maxPrice) {
    whereClause.prix = {};
    if (minPrice) whereClause.prix.gte = Number(minPrice);
    if (maxPrice) whereClause.prix.lte = Number(maxPrice);
  }

  if (minRating) {
    whereClause.noteMoyenne = { gte: Number(minRating) };
  }

  if (promo === "true") {
    whereClause.prixPromo = { gt: 0 };
  }

  try {
    // Fetch filtered products & count
    const totalProducts = await prisma.produit.count({ where: whereClause });
    const products = await prisma.produit.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      select: getProductSelect(),
      skip,
      take: pageSize,
    });

    // Format the response
    const data = products.map((product) => formatProductData(product));

    // Pagination response
    const pagination = {
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      pageSize,
    };

    // Return response
    return NextResponse.json(
      {
        message: "Les résultats de la recherche ont été récupérés avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
