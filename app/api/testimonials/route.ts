import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET(_req: NextRequest) {
  try {
    const testimonials = await prisma.temoignage.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des témoignages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { nom, prenom, texte, note, imagePublicId } = body;

    if (!nom || !prenom || !texte || !note) {
      return NextResponse.json(
        { message: "Données manquantes" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.temoignage.create({
      data: {
        nom,
        prenom,
        texte,
        note: parseInt(note),
        imagePublicId,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du témoignage" },
      { status: 500 }
    );
  }
}
