/*
  Warnings:

  - Added the required column `folderPath` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "folderPath" TEXT NOT NULL;
