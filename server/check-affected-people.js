const { PrismaClient } = require('@prisma/client');

async function checkAffectedPeople() {
  const prisma = new PrismaClient();

  try {
    const affectedPeople = await prisma.affectedPerson.findMany({
      take: 5,
      include: {
        barangay: true,
        incidentReport: {
          select: {
            id: true,
            barangayId: true,
            barangay: true
          }
        }
      }
    });

    console.log('Affected People Records:');
    console.log(JSON.stringify(affectedPeople, null, 2));

    // Also check if there are any incident reports
    const incidentReports = await prisma.incidentReport.findMany({
      take: 3,
      include: {
        affectedPeople: {
          include: { barangay: true }
        },
        barangay: true
      }
    });

    console.log('\nIncident Reports:');
    console.log(JSON.stringify(incidentReports, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAffectedPeople();