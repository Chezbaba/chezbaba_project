import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { newsletterSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Valiate the request body
        const result = newsletterSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // Save to database
        try {
            await prisma.newsletter.create({
                data: { email },
            });

            return NextResponse.json(
                { message: "Merci de vous être abonné à notre newsletter !" },
                { status: 201 }
            );
        } catch (dbError) {
            if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
                if (dbError.code === "P2002") {
                    return NextResponse.json(
                        { error: "Cette adresse e-mail est déjà abonnée." },
                        { status: 400 }
                    );
                }
            }
            throw dbError;
        }
    } catch (error) {
        console.error("API Error [POST /api/newsletter] :", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'inscription." },
            { status: 500 }
        );
    }
}
