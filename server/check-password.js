const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'sanroque' },
    });
    console.log('User sanroque:', user);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword();
