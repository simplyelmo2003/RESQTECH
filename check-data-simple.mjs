import('http').then(http => {
  const options = {
    hostname: 'db.yizddeokgbwtrwozxpwm.supabase.co',
    port: 5432,
    protocol: 'postgresql:',
    auth: 'postgres:Elmojee082924'
  };
  
  console.log('Attempting to connect to Supabase PostgreSQL...\n');
  console.log('Host: db.yizddeokgbwtrwozxpwm.supabase.co');
  console.log('Port: 5432');
  console.log('Database: postgres\n');
});

// Alternative: Check using curl command via PowerShell
// This would require curl to be available
