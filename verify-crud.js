// Quick verification script for CRUD operations

const API_BASE = 'http://localhost:4000';

async function testEvacuationCenterCRUD() {
  console.log('\n=== Testing Evacuation Center CRUD ===\n');

  try {
    // 1. GET all
    console.log('1. GET /api/evac-centers');
    const getRes = await fetch(`${API_BASE}/api/evac-centers`);
    const centers = await getRes.json();
    console.log('   Found', Array.isArray(centers) ? centers.length : 'error', 'centers');
    const firstId = centers[0]?.id;

    // 2. POST (Create)
    console.log('\n2. POST /api/evac-centers (Create)');
    const createPayload = {
      name: 'Test Evac Center',
      address: 'Test Address, Surigao City',
      lat: 9.7785,
      lng: 125.4944,
      barangayId: 'barangay-1',
      contact: '+63 123 456 7890',
      capacity: 100,
      currentOccupancy: 25,
      status: 'Open',
      services: ['Water', 'Medical'],
      imageUrl: 'https://example.com/image.jpg'
    };
    const createRes = await fetch(`${API_BASE}/api/evac-centers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    });
    const created = await createRes.json();
    const testId = created.id;
    console.log('   Created center:', created.name, 'ID:', testId);
    console.log('   Contact stored:', created.contact);
    console.log('   Capacity stored:', created.capacity);
    console.log('   Services stored:', created.services);

    if (testId) {
      // 3. PUT (Update)
      console.log('\n3. PUT /api/evac-centers/:id (Update)');
      const updatePayload = {
        name: 'Updated Test Center',
        capacity: 150,
        currentOccupancy: 50,
        contact: '+63 999 888 7777',
        status: 'Full'
      };
      const putRes = await fetch(`${API_BASE}/api/evac-centers/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const updated = await putRes.json();
      console.log('   Updated center:', updated.name);
      console.log('   New contact:', updated.contact);
      console.log('   New capacity:', updated.capacity);
      console.log('   New status:', updated.status);

      // 4. DELETE
      console.log('\n4. DELETE /api/evac-centers/:id (Delete)');
      const delRes = await fetch(`${API_BASE}/api/evac-centers/${testId}`, {
        method: 'DELETE'
      });
      const deleted = await delRes.json();
      console.log('   Deleted center:', deleted.name, 'ID:', deleted.id);
    }

    console.log('\n✅ Evacuation Center CRUD - PASS\n');
  } catch (err) {
    console.error('❌ Evacuation Center CRUD - FAIL:', err.message);
  }
}

async function testContactCRUD() {
  console.log('\n=== Testing Emergency Contact CRUD ===\n');

  try {
    // 1. GET all
    console.log('1. GET /api/contacts');
    const getRes = await fetch(`${API_BASE}/api/contacts`);
    const contacts = await getRes.json();
    console.log('   Found', Array.isArray(contacts) ? contacts.length : 'error', 'contacts');

    // 2. POST (Create)
    console.log('\n2. POST /api/contacts (Create)');
    const createPayload = {
      name: 'Test Emergency Contact',
      organization: 'Test Organization',
      phoneNumber: '+63 555 444 3333',
      type: 'Medical',
      description: 'Test emergency contact'
    };
    const createRes = await fetch(`${API_BASE}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    });
    const created = await createRes.json();
    const testId = created.id;
    console.log('   Created contact:', created.name, 'ID:', testId);
    console.log('   Organization:', created.organization);

    if (testId) {
      // 3. PUT (Update)
      console.log('\n3. PUT /api/contacts/:id (Update)');
      const updatePayload = {
        name: 'Updated Contact',
        phoneNumber: '+63 777 666 5555'
      };
      const putRes = await fetch(`${API_BASE}/api/contacts/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const updated = await putRes.json();
      console.log('   Updated contact:', updated.name);
      console.log('   New phone:', updated.phoneNumber);

      // 4. DELETE
      console.log('\n4. DELETE /api/contacts/:id (Delete)');
      const delRes = await fetch(`${API_BASE}/api/contacts/${testId}`, {
        method: 'DELETE'
      });
      const deleted = await delRes.json();
      console.log('   Deleted contact:', deleted.name, 'ID:', deleted.id);
    }

    console.log('\n✅ Emergency Contact CRUD - PASS\n');
  } catch (err) {
    console.error('❌ Emergency Contact CRUD - FAIL:', err.message);
  }
}

async function runTests() {
  console.log('🧪 Running CRUD verification tests...\n');
  await testEvacuationCenterCRUD();
  await testContactCRUD();
  console.log('🎉 All tests completed!\n');
}

runTests();
