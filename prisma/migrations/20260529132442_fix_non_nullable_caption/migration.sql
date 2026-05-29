/*
  Warnings:

  - Made the column `caption` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "caption" SET NOT NULL;
