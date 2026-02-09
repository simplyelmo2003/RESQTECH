import { PrismaClient } from '@prisma/client';

// Supabase connection string
const supabaseUrl = 'postgresql://postgres:Elmojee082924@db.yizddeokgbwtrwozxpwm.supabase.co:5432/postgres';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: supabaseUrl,
    },
  },
});

async function checkData() {
  try {
    console.log('Connecting to Supabase...\n');

    // Check row counts for each table
    const tables = [
      { name: 'alert', label: 'Alerts' },
      { name: 'barangay', label: 'Barangays' },
      { name: 'contact', label: 'Contacts' },
      { name: 'evacCenter', label: 'Evac Centers' },
      { name: 'incidentReport', label: 'Incident Reports' },
      { name: 'affectedPerson', label: 'Affected People' },
      { name: 'user', label: 'Users' },
    ];

    let totalRecords = 0;

    for (const table of tables) {
      try {
        const count = await prisma[table.name].count();
        console.log(`${table.label}: ${count} records`);
        totalRecords += count;
      } catch (err) {
        console.log(`${table.label}: Error - ${err.message.split('\n')[0]}`);
      }
    }

    console.log(`\n📊 Total records across all tables: ${totalRecords}`);

    if (totalRecords === 0) {
      console.log('\n⚠️  No data found in Supabase. Tables exist but are empty.');
      console.log('Status: DATA TRANSFER NOT COMPLETE');
    } else {
      console.log('\n✅ Data has been successfully imported!');
      console.log('Status: DATA TRANSFER SUCCESSFUL');
    }
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
