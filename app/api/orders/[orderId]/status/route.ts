import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { getOrderSelect } from "@/lib/helpers/orders";
import { prisma } from "@/lib/utils/prisma";
import { CommandeStatut } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  // Check if the user is authenticated
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  const { orderId } = await params;
  const { statut } = await req.json();
  const userRole = session.user.role;
  const userId = session.user.id;

  // check if statut is valid
  if (!Object.values(CommandeStatut).includes(statut)) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch the order to check ownership
    const existingOrder = await prisma.commande.findUnique({
      where: { id: String(orderId) },
      select: { clientId: true },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // 2. Authorization Logic
    if (userRole === "ADMIN") {
      // Admin can do everything (already implied)
    } else if (userRole === "CLIENT") {
      // Client can ONLY set status to LIVREE and ONLY for their own order
      if (existingOrder.clientId !== userId) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
      }
      if (statut !== CommandeStatut.LIVREE) {
        return NextResponse.json(
          { error: "Vous ne pouvez que confirmer la réception (statut LIVREE)." },
          { status: 403 }
        );
      }
    } else {
      // Vendors or others cannot update status via this route (yet)
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // 3. Update the order
    const order = await prisma.commande.update({
      where: { id: String(orderId) },
      data: { statut },
      select: getOrderSelect(),
    });

    // --- Notificaton Logic ---
    if (statut === CommandeStatut.LIVREE) {
      if (userRole === "CLIENT") {
        // Client confirmed delivery -> Notify Vendor(s)
        const lines = await prisma.ligneCommande.findMany({
          where: { commandeId: order.id },
          include: { produit: { include: { produitMarketplace: true } } },
        });

        const vendorIds = new Set<string>();
        for (const line of lines) {
          if (line.produit?.produitMarketplace?.vendeurId) {
            vendorIds.add(line.produit.produitMarketplace.vendeurId);
          }
        }

        for (const vendorId of Array.from(vendorIds)) {
          await prisma.notification.create({
            data: {
              userId: vendorId,
              type: "LIVRAISON", // Using string literal if enum import is tricky, otherwise NotificationType.LIVRAISON
              objet: "Commande reçue !",
              text: `Le client a confirmé la réception de la commande #${order.id}.`,
              urlRedirection: `/vendor/orders?search=${order.id}`,
            },
          });
        }
      } else {
        // Admin/Vendor updated to LIVREE -> Notify Client
        if (order.client?.user?.id) {
          await prisma.notification.create({
            data: {
              userId: order.client.user.id,
              type: "LIVRAISON",
              objet: "Commande livrée !",
              text: `Votre commande #${order.id} a été livrée.`,
              urlRedirection: `/client/orders`,
            },
          });
        }
      }
    } else if (statut === CommandeStatut.EXPEDIEE) {
      // Notify Client
      if (order.client?.user?.id) {
        await prisma.notification.create({
          data: {
            userId: order.client.user.id,
            type: "LIVRAISON",
            objet: "Commande expédiée !",
            text: `Votre commande #${order.id} a été expédiée.`,
            urlRedirection: `/client/orders`,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: "Le statut de la commande a été mis à jour avec succès",
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
