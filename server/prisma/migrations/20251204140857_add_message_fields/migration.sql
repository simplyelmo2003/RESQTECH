-- AlterTable
ALTER TABLE "message" ADD COLUMN     "barangayId" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "recipientBarangayId" TEXT,
ADD COLUMN     "recipientRole" TEXT NOT NULL DEFAULT 'all',
ADD COLUMN     "senderName" TEXT NOT NULL DEFAULT 'System',
ADD COLUMN     "senderRole" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'general',
ALTER COLUMN "conversationId" DROP NOT NULL;
