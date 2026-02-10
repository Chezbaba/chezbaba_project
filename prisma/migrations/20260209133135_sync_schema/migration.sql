/*
  Warnings:

  - You are about to drop the column `wilaya` on the `adresse` table. All the data in the column will be lost.
  - Added the required column `quartier` to the `adresse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adresse" DROP COLUMN "wilaya",
ADD COLUMN     "quartier" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "produit" ADD COLUMN     "delai_livraison" VARCHAR(50),
ADD COLUMN     "garantie" VARCHAR(50),
ADD COLUMN     "prix_promo" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "nom" SET DEFAULT '',
ALTER COLUMN "prenom" SET DEFAULT '';

-- CreateTable
CREATE TABLE "produit_video" (
    "id" VARCHAR(25) NOT NULL,
    "video_public_id" VARCHAR(255) NOT NULL,
    "produit_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "produit_video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" VARCHAR(255),
    "id_token" TEXT,
    "session_state" VARCHAR(255),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temoignage" (
    "id" VARCHAR(25) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "texte" VARCHAR(500) NOT NULL,
    "note" INTEGER NOT NULL DEFAULT 5,
    "image_public_id" VARCHAR(255),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temoignage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter" (
    "id" VARCHAR(25) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favori" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "produit_id" VARCHAR(25) NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produit_video_produit_id_key" ON "produit_video"("produit_id");

-- CreateIndex
CREATE INDEX "index_produit_video_produit_id" ON "produit_video"("produit_id");

-- CreateIndex
CREATE INDEX "index_account_user_id" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- CreateIndex
CREATE INDEX "index_favori_user_id" ON "favori"("user_id");

-- CreateIndex
CREATE INDEX "index_favori_produit_id" ON "favori"("produit_id");

-- CreateIndex
CREATE UNIQUE INDEX "favori_user_id_produit_id_key" ON "favori"("user_id", "produit_id");

-- AddForeignKey
ALTER TABLE "produit_video" ADD CONSTRAINT "produit_video_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favori" ADD CONSTRAINT "favori_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favori" ADD CONSTRAINT "favori_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
