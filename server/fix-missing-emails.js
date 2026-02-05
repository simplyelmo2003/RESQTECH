const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateMissingEmails() {
  try {
    // Get all users with null email
    const usersWithoutEmail = await prisma.user.findMany({
      where: { email: null },
    });

    console.log(`Found ${usersWithoutEmail.length} users without email`);

    // Update each user to use their username as email
    for (const user of usersWithoutEmail) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { email: user.username },
      });
      console.log(`✅ Updated ${user.username} with email: ${updated.email}`);
    }

    console.log('✅ All users updated!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateMissingEmails();
