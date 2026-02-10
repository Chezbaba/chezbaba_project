-- AlterTable
ALTER TABLE "categorie" ADD COLUMN     "image_public_id" VARCHAR(255),
ADD COLUMN     "parent_id" VARCHAR(25);

-- CreateIndex
CREATE INDEX "index_categorie_parent_id" ON "categorie"("parent_id");

-- AddForeignKey
ALTER TABLE "categorie" ADD CONSTRAINT "categorie_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categorie"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
