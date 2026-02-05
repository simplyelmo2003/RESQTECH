const { PrismaClient } = require('@prisma/client');

async function list() {
  const prisma = new PrismaClient();
  try {
    const reports = await prisma.incidentReport.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, reporterName: true, barangayId: true, createdAt: true, description: true }
    });
    const byBrgy = {};
    for (const r of reports) {
      const b = r.barangayId || 'NULL';
      if (!byBrgy[b]) byBrgy[b] = [];
      byBrgy[b].push(r);
    }
    console.log('Reports grouped by barangayId:');
    for (const [b, arr] of Object.entries(byBrgy)) {
      console.log(`- ${b}: ${arr.length} reports`);
      console.log(arr.slice(0,3));
    }
  } catch (e) { console.error(e); }
  finally { await prisma.$disconnect(); }
}

list();