const { PrismaClient } = require('@prisma/client');

async function checkMessages() {
  const prisma = new PrismaClient();
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log('Recent messages:');
    messages.forEach(m => {
      console.log(`ID: ${m.id}, ConvID: ${m.conversationId}, Sender: ${m.sender}, Body: ${m.body ? m.body.substring(0, 50) : ''}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMessages();