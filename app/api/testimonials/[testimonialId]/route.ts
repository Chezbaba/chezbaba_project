import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const { testimonialId } = await params;
    const session = await auth();
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { nom, prenom, texte, note, imagePublicId } = body;

    const testimonial = await prisma.temoignage.update({
      where: { id: testimonialId },
      data: {
        nom,
        prenom,
        texte,
        note: note ? parseInt(note) : undefined,
        imagePublicId,
      },
    });

    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du témoignage" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const { testimonialId } = await params;
    const session = await auth();
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    await prisma.temoignage.delete({
      where: { id: testimonialId },
    });

    return NextResponse.json(
      { message: "Témoignage supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression du témoignage" },
      { status: 500 }
    );
  }
}
