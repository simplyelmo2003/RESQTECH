const { PrismaClient } = require('@prisma/client');

async function checkAffectedPeople() {
  const prisma = new PrismaClient();

  try {
    const reports = await prisma.incidentReport.findMany({
      include: {
        affectedPeople: {
          include: { barangay: true }
        }
      }
    });

    console.log('Total incident reports:', reports.length);
    const reportsWithPeople = reports.filter(r => r.affectedPeople.length > 0);
    console.log('Reports with affected people:', reportsWithPeople.length);

    if (reportsWithPeople.length > 0) {
      console.log('\nSample report with people:');
      console.log(JSON.stringify(reportsWithPeople[0], null, 2));
    } else {
      console.log('\nNo incident reports have affected people records yet.');
      console.log('This explains why barangay shows as "N/A" - there are no affected people to display barangay info for.');
    }

    // Also check total affected people count
    const totalPeople = await prisma.affectedPerson.count();
    console.log('\nTotal affected people records in database:', totalPeople);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAffectedPeople();