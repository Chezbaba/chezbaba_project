import insertCategories from "@/lib/seed/insertCategories";
import { prisma } from "@/lib/utils/prisma";

async function main() {
    console.log("Only seeding categories...");
    await insertCategories();
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
