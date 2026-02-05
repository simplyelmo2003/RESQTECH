import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ensureConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export default prisma;
