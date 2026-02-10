import { prisma } from "@/lib/utils/prisma";

async function main() {
    console.log("Suppression des données de test...");

    // Delete in order to respect foreign keys
    console.log("Suppression des avis et réponses...");
    await prisma.reponseEvaluation.deleteMany();
    await prisma.evaluation.deleteMany();

    console.log("Suppression des commandes et paniers...");
    await prisma.ligneCommande.deleteMany();
    await prisma.commande.deleteMany();
    await prisma.lignePanier.deleteMany();
    await prisma.panier.deleteMany();

    console.log("Suppression des médias et favoris...");
    await prisma.produitImage.deleteMany();
    await prisma.produitVideo.deleteMany();
    await prisma.favori.deleteMany();
    await prisma.signalement.deleteMany();

    console.log("Suppression des liaisons boutique/marketplace...");
    await prisma.produitBoutique.deleteMany();
    await prisma.produitMarketplace.deleteMany();

    console.log("Suppression des produits...");
    await prisma.produit.deleteMany();

    console.log("✅ Terminé ! Produits, Commandes, Avis, Paniers supprimés.");
    console.log("ℹ️ Les Catégories, Filtres (Tailles/Couleurs), et Utilisateurs sont conservés.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
