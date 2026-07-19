-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('men', 'women', 'kids');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('Summer', 'Winter', 'AllSeason');

-- CreateTable
CREATE TABLE "logecilowner" (
    "idowner" SERIAL NOT NULL,
    "name_company" VARCHAR(255) NOT NULL,
    "name_owner" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(255) NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255)[],

    CONSTRAINT "logecilowner_pkey" PRIMARY KEY ("idowner")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) NOT NULL,
    "Description" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255)[],
    "ParentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) NOT NULL,
    "Description" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "season" "Season",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "color" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(255) NOT NULL,
    "barcode" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "image" VARCHAR(255)[],

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_Name_key" ON "Category"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_Slug_key" ON "Category"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_Slug_key" ON "Product"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_key" ON "Variant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_barcode_key" ON "Variant"("barcode");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
