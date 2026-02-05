const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUsers() {
  try {
    // Update existing users to add email
    const admin = await prisma.user.update({
      where: { username: 'admin@example.com' },
      data: { email: 'admin@example.com' },
    });
    console.log('✅ Updated admin user with email:', admin.email);

    const barangay = await prisma.user.update({
      where: { username: 'barangay@example.com' },
      data: { email: 'barangay@example.com' },
    });
    console.log('✅ Updated barangay user with email:', barangay.email);

    const guest = await prisma.user.update({
      where: { username: 'guest@example.com' },
      data: { email: 'guest@example.com' },
    });
    console.log('✅ Updated guest user with email:', guest.email);

    // Also update testuser_001 if it exists
    try {
      const testuser = await prisma.user.update({
        where: { username: 'testuser_001' },
        data: { email: 'testuser@example.com' },
      });
      console.log('✅ Updated testuser_001 with email:', testuser.email);
    } catch (e) {
      console.log('ℹ️ testuser_001 not found, skipping');
    }

    console.log('✅ All users updated!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers();
