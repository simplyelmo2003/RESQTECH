const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEmails() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true },
    });
    console.log('All users in database:');
    console.table(users);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmails();
