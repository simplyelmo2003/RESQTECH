import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma, { ensureConnection } from './prismaClient';

// Only load .env in development, not in production (e.g., Render)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Global error handler for uncaught exceptions in async handlers
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
});

// Request logging middleware for debugging incoming requests
app.use((req, res, next) => {
  try {
    const safeBody = (() => {
      try { return JSON.stringify(req.body); } catch { return '[unserializable]'; }
    })();
    console.log(`➡️ ${req.method} ${req.originalUrl} — body: ${safeBody}`);
  } catch (e: unknown) {
    console.log('➡️ request logging error', e);
  }
  next();
});

const PORT = process.env.PORT || 4000;

app.get('/api/health', async (_req, res) => {
  try {
    // Check DB connectivity as part of health
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', db: 'ok', now: new Date().toISOString() });
  } catch (e) {
    return res.status(503).json({ status: 'degraded', db: 'unavailable', error: String(e) });
  }
});

// Incident reports
app.get('/api/incident-reports', async (_req, res) => {
  try {
    const reports = await prisma.incidentReport.findMany({ orderBy: { createdAt: 'desc' } });
    console.log('📤 GET /api/incident-reports: returning', reports.length, 'reports');
    if (reports.length > 0) {
      console.log('   First report:', { id: reports[0].id, reporterName: reports[0].reporterName, type: reports[0].type });
    }
    res.json(reports);
  } catch (e) {
    console.error('GET /api/incident-reports error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Debug endpoint - get most recent report
app.get('/api/incident-reports/debug/latest', async (_req, res) => {
  try {
    const latest = await prisma.incidentReport.findFirst({ orderBy: { createdAt: 'desc' } });
    res.json(latest || { message: 'No reports yet' });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/incident-reports', async (req, res) => {
  try {
    console.log('📥 POST /api/incident-reports received:', JSON.stringify(req.body));
    const { reporterName, reporterContact, type, description, locationDescription, latitude, longitude, barangayId, imageUrls } = req.body;
    console.log('🔍 Extracted fields:', {
      reporterName,
      reporterContact,
      type,
      description,
      locationDescription,
      latitude,
      longitude,
      imageUrls,
      barangayId
    });
    
    // Validate required fields
    if (!description || !type) {
      console.warn('⚠️ Missing required fields: description or type');
      return res.status(400).json({ error: 'Missing required fields: description, type' });
    }
    
    const created = await prisma.incidentReport.create({
      data: {
        reporterName: reporterName || 'Anonymous',
        reporterContact: reporterContact || null,
        type: type || 'Other',
        description: description || '',
        locationDescription: locationDescription || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        imageUrls: imageUrls || null,
        status: 'Pending',
        barangayId: barangayId || null,
      }
    });
    console.log('✅ Incident report created:', created.id);
    res.status(201).json(created);
  } catch (e) {
    console.error('❌ POST /api/incident-reports error:', e);
    res.status(500).json({ error: 'Failed to create incident report', details: String(e) });
  }
});

// Update incident report (PUT)
app.put('/api/incident-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, description, type, locationDescription, imageUrls } = req.body;
    console.log('📥 PUT /api/incident-reports/:id received:', { id, status, adminNotes });

    const updated = await prisma.incidentReport.update({
      where: { id },
      data: {
        status: status || undefined,
        adminNotes: adminNotes || undefined,
        description: description || undefined,
        type: type || undefined,
        locationDescription: locationDescription || undefined,
        imageUrls: imageUrls !== undefined ? imageUrls : undefined,
        updatedAt: new Date(),
      }
    });
    console.log('✅ Incident report updated:', updated.id, 'new status:', updated.status);
    res.json(updated);
  } catch (e) {
    console.error('❌ PUT /api/incident-reports/:id error:', e);
    res.status(500).json({ error: 'Failed to update incident report', details: String(e) });
  }
});

// Delete incident report
app.delete('/api/incident-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 DELETE /api/incident-reports/:id received:', id);
    const deleted = await prisma.incidentReport.delete({ where: { id } });
    console.log('🗑️ Incident report deleted:', deleted.id);
    res.json({ success: true, id: deleted.id });
  } catch (e: any) {
    console.error('❌ DELETE /api/incident-reports/:id error:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete incident report', details: String(e) });
  }
});

// Messages (simple CRUD)
app.get('/api/messages', async (_req, res) => {
  try {
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(msgs);
  } catch (e) {
    console.error('GET /api/messages error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { conversationId, sender, body, senderName, senderRole, senderBarangayId, subject, type, isRead, recipientRole, recipientBarangayId } = req.body;
    const created = await prisma.message.create({ 
      data: { 
        conversationId, 
        sender, 
        body,
        senderName: senderName || 'System',
        senderRole: senderRole || 'admin',
        barangayId: senderBarangayId,
        subject: subject || '',
        type: type || 'general',
        isRead: isRead || false,
        recipientRole: recipientRole || 'all',
        recipientBarangayId,
      } 
    });
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/messages error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Evac centers
app.get('/api/evac-centers', async (_req, res) => {
  try {
    const centers = await prisma.evacCenter.findMany();
    res.json(centers);
  } catch (e) {
    console.error('GET /api/evac-centers error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/evac-centers', async (req, res) => {
  try {
    const { name, address, lat, lng, barangayId, contact, capacity, currentOccupancy, status, services, imageUrl } = req.body;
    const created = await prisma.evacCenter.create({ 
      data: { 
        name, 
        address, 
        lat, 
        lng, 
        barangayId,
        contact,
        capacity: capacity ? Number(capacity) : 0,
        currentOccupancy: currentOccupancy ? Number(currentOccupancy) : 0,
        status: status || 'Open',
        services: services ? JSON.stringify(services) : null
      } 
    });
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/evac-centers error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.put('/api/evac-centers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, lat, lng, barangayId, contact, capacity, currentOccupancy, status, services } = req.body;
    const updated = await prisma.evacCenter.update({
      where: { id },
      data: {
        name,
        address,
        lat,
        lng,
        barangayId,
        contact,
        capacity: capacity ? Number(capacity) : 0,
        currentOccupancy: currentOccupancy ? Number(currentOccupancy) : 0,
        status: status || 'Open',
        services: services ? JSON.stringify(services) : null,
        updatedAt: new Date()
      }
    });
    res.json(updated);
  } catch (e) {
    console.error('PUT /api/evac-centers/:id error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.delete('/api/evac-centers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.evacCenter.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    console.error('DELETE /api/evac-centers/:id error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Alerts
app.get('/api/alerts', async (_req, res) => {
  try {
    const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(alerts);
  } catch (e) {
    console.error('GET /api/alerts error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const { title, description, areaAffected } = req.body;
    const created = await prisma.alert.create({ data: { title, description, areaAffected } });
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/alerts error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.delete('/api/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.alert.delete({ where: { id } });
    res.status(204).send();
  } catch (e: any) {
    console.error('DELETE /api/alerts/:id error:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.status(500).json({ error: String(e) });
  }
});

// News
app.get('/api/news', async (_req, res) => {
  try {
    const items = await prisma.news.findMany({ orderBy: { publishedAt: 'desc' } });
    console.log('📰 GET /api/news: found', items.length, 'items');
    if (items.length > 0) {
      console.log('   First item:', { id: items[0].id, title: items[0].title });
    }
    res.json(items);
  } catch (e) {
    console.error('GET /api/news error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    console.log('📝 POST /api/news received:', JSON.stringify(req.body, null, 2));
    const { title, content, category, mediaType, mediaUrl, thumbnailUrl, author, source } = req.body;
    console.log('📋 Category received:', category, 'Type:', typeof category, 'IsArray:', Array.isArray(category));
    
    // Validation
    if (!title || !content) {
      console.error('POST /api/news validation error: missing title or content', { title, content });
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const created = await prisma.news.create({ 
      data: { 
        title, 
        content, 
        category: Array.isArray(category) ? JSON.stringify(category) : category,
        mediaType, 
        mediaUrl, 
        thumbnailUrl, 
        author, 
        source 
      } 
    });
    console.log('✅ News item created:', created.id, 'with category:', created.category);
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/news error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Alias routes in case frontend uses an admin-prefixed path
app.post('/api/admin/news', async (req, res) => {
  try {
    console.log('📝 POST /api/admin/news received:', JSON.stringify(req.body, null, 2));
    const { title, content, category, mediaType, mediaUrl, thumbnailUrl, author, source } = req.body;
    if (!title || !content) {
      console.error('POST /api/admin/news validation error: missing title or content', { title, content });
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const created = await prisma.news.create({
      data: {
        title,
        content,
        category: Array.isArray(category) ? JSON.stringify(category) : category,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        author,
        source,
      },
    });
    console.log('✅ News item created (admin alias):', created.id);
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/admin/news error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/admin/news', async (req, res) => {
  try {
    console.log('📝 POST /admin/news received:', JSON.stringify(req.body, null, 2));
    const { title, content, category, mediaType, mediaUrl, thumbnailUrl, author, source } = req.body;
    if (!title || !content) {
      console.error('POST /admin/news validation error: missing title or content', { title, content });
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const created = await prisma.news.create({
      data: {
        title,
        content,
        category: Array.isArray(category) ? JSON.stringify(category) : category,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        author,
        source,
      },
    });
    console.log('✅ News item created (admin alias):', created.id);
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /admin/news error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 DELETE /api/news/:id received:', id);
    const deleted = await prisma.news.delete({ where: { id } });
    console.log('🗑️ News item deleted:', deleted.id);
    res.json({ success: true, id: deleted.id });
  } catch (e: any) {
    console.error('❌ DELETE /api/news/:id error:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.status(500).json({ error: 'Failed to delete news item', details: String(e) });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📝 PUT /api/news/:id received:', id, JSON.stringify(req.body, null, 2));
    const { title, content, category, mediaType, mediaUrl, thumbnailUrl, author, source } = req.body;
    console.log('📋 Category received for update:', category, 'Type:', typeof category, 'IsArray:', Array.isArray(category));
    
    const updated = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        category: Array.isArray(category) ? JSON.stringify(category) : category,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        author,
        source,
      }
    });
    console.log('✅ News item updated:', updated.id, 'with category:', updated.category);
    res.json(updated);
  } catch (e: any) {
    console.error('❌ PUT /api/news/:id error:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.status(500).json({ error: 'Failed to update news item', details: String(e) });
  }
});

// Contacts
app.get('/api/contacts', async (_req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    console.log('📇 GET /api/contacts: found', contacts.length, 'contacts');
    if (contacts.length > 0) {
      console.log('   First contact:', { id: contacts[0].id, name: contacts[0].name });
    }
    res.json(contacts);
  } catch (e) {
    console.error('GET /api/contacts error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, organization, phoneNumber, type, description } = req.body;
    const created = await prisma.contact.create({ data: { name, organization, phoneNumber, type, description } });
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/contacts error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, organization, phoneNumber, type, description } = req.body;
    const updated = await prisma.contact.update({
      where: { id },
      data: { name, organization, phoneNumber, type, description }
    });
    res.json(updated);
  } catch (e) {
    console.error('PUT /api/contacts/:id error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.contact.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    console.error('DELETE /api/contacts/:id error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Authentication - Login endpoint (accepts both username and email)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 POST /api/auth/login - incoming request body:', { username, password });
    
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Try to find user by username first
    console.log('🔍 Looking up user by username:', username);
    let user = await prisma.user.findUnique({ where: { username } }).catch(() => null);
    
    // If not found and input looks like email, try email lookup
    if (!user && username.includes('@')) {
      console.log('🔍 Username lookup failed, trying email lookup for:', username);
      user = await prisma.user.findFirst({ where: { email: username } }).catch(() => null);
      
      // If still not found, try extracting the part before @ and use that as username
      if (!user) {
        const usernamePart = username.split('@')[0];
        console.log('🔍 Email lookup failed, trying username from email part:', usernamePart);
        user = await prisma.user.findUnique({ where: { username: usernamePart } }).catch(() => null);
      }
    }
    
    if (!user) {
      console.log('❌ User not found with username or email:', username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    console.log('✅ User found:', { id: user.id, username: user.username, email: user.email });
    console.log('🔐 Comparing passwords...');
    
    // Simple password check (in production, use bcrypt or similar)
    if (user.password !== password) {
      console.log('❌ Invalid password for user:', user.username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    console.log('✅ Login successful for user:', user.username, 'role:', user.role, 'barangayId:', user.barangayId);
    
    // Return user data with barangayId and email (use username as fallback for email if null)
    res.json({
      id: user.id,
      username: user.username,
      email: user.email || user.username,
      role: user.role,
      barangayId: user.barangayId,
      token: 'token-' + user.id, // Generate a simple token
      createdAt: user.createdAt,
    });
  } catch (e) {
    console.error('❌ POST /api/auth/login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Users (basic list/create for admin tooling)
app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error('GET /api/users error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, role, barangayId } = req.body;
    console.log('📝 POST /api/users - incoming request body:', JSON.stringify(req.body, null, 2));
    console.log('📝 Extracted fields:', { username, email, password, role, barangayId });
    console.log('📝 Email type:', typeof email, 'Email value:', email, 'Email truthy?', !!email);
    
    // Validate required fields
    if (!username || !password) {
      console.warn('⚠️ Missing required fields');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    try {
      const created = await prisma.user.create({ 
        data: { 
          username, 
          email: email || null, 
          password, 
          role, 
          barangayId: barangayId || null 
        } 
      });
      console.log('✅ User created:', created.id, created.username, 'email:', created.email);
      res.status(201).json(created);
    } catch (dbError: any) {
      console.error('❌ Database error in POST /api/users:', dbError.message, dbError.code);
      throw dbError;
    }
  } catch (e: any) {
    console.error('❌ POST /api/users error:', e.message || String(e));
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Update user (PUT)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, barangayId, isActive } = req.body;
    console.log('📝 PUT /api/users/:id - updating user:', id, 'role:', role, 'barangayId:', barangayId, 'email:', email);
    
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email !== undefined && { email: email || null }),
        ...(role && { role }),
        ...(barangayId !== undefined && { barangayId }),
      },
    });
    console.log('✅ User updated:', updated.id, updated.username);
    res.json(updated);
  } catch (e) {
    console.error('❌ PUT /api/users/:id error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Delete user (DELETE)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ DELETE /api/users/:id - deleting user:', id);
    
    const deleted = await prisma.user.delete({ where: { id } });
    console.log('✅ User deleted:', deleted.id);
    res.json({ message: 'User deleted successfully', id });
  } catch (e) {
    console.error('❌ DELETE /api/users/:id error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Barangay Affected People Management
app.get('/api/barangay/affected-people', async (req, res) => {
  try {
    const { barangayId } = req.query;
    if (!barangayId) {
      return res.status(400).json({ error: 'barangayId is required' });
    }

    const people = await prisma.affectedPerson.findMany({
      where: { barangayId: barangayId as string },
      include: { barangay: true },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`👥 GET /api/barangay/affected-people: found ${people.length} affected people for barangay ${barangayId}`);
    res.json(people);
  } catch (e) {
    console.error('GET /api/barangay/affected-people error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/barangay/affected-people', async (req, res) => {
  try {
    const { name, sex, age, purok, birthday, affected, evacuated, barangayId } = req.body;

    if (!name || !barangayId) {
      return res.status(400).json({ error: 'Name and barangayId are required' });
    }

    // For now, we'll create a dummy incident report or use an existing one
    // This is a temporary solution until we modify the schema
    let incidentReportId;
    const existingReport = await prisma.incidentReport.findFirst({
      where: { barangayId: barangayId as string }
    });

    if (existingReport) {
      incidentReportId = existingReport.id;
    } else {
      // Create a dummy incident report for this barangay
      const dummyReport = await prisma.incidentReport.create({
        data: {
          reporterName: 'Barangay Official',
          type: 'Barangay Management',
          description: 'System-generated report for barangay affected people management',
          locationDescription: barangayId as string,
          barangayId: barangayId as string,
          status: 'active'
        }
      });
      incidentReportId = dummyReport.id;
    }

    const created = await prisma.affectedPerson.create({
      data: {
        name,
        sex: sex || null,
        age: age ? parseInt(age) : null,
        purok: purok || null,
        birthday: birthday ? new Date(birthday) : null,
        affected: affected || false,
        evacuated: evacuated || false,
        barangayId: barangayId as string,
        incidentReportId
      },
      include: { barangay: true }
    });

    console.log(`✅ POST /api/barangay/affected-people: created affected person ${created.id}`);
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/barangay/affected-people error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.put('/api/barangay/affected-people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sex, age, purok, birthday, affected, evacuated } = req.body;

    const updated = await prisma.affectedPerson.update({
      where: { id },
      data: {
        name: name || undefined,
        sex: sex || undefined,
        age: age ? parseInt(age) : undefined,
        purok: purok || undefined,
        birthday: birthday ? new Date(birthday) : undefined,
        affected: affected !== undefined ? affected : undefined,
        evacuated: evacuated !== undefined ? evacuated : undefined
      },
      include: { barangay: true }
    });

    console.log(`✅ PUT /api/barangay/affected-people/${id}: updated affected person`);
    res.json(updated);
  } catch (e: any) {
    console.error(`PUT /api/barangay/affected-people/${req.params.id} error:`, e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Affected person not found' });
    }
    res.status(500).json({ error: String(e) });
  }
});

app.delete('/api/barangay/affected-people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.affectedPerson.delete({
      where: { id }
    });

    console.log(`🗑️ DELETE /api/barangay/affected-people/${id}: deleted affected person`);
    res.json({ success: true, id: deleted.id });
  } catch (e: any) {
    console.error(`DELETE /api/barangay/affected-people/${req.params.id} error:`, e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Affected person not found' });
    }
    res.status(500).json({ error: String(e) });
  }
});

// Logs
app.get('/api/logs', async (_req, res) => {
  try {
    const logs = await prisma.logEntry.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(logs);
  } catch (e) {
    console.error('GET /api/logs error:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    // Accept flexible log payloads from frontend: prefer explicit `message`, then `purpose`, then `details.message`/`details.title`
    const { level = 'info', message: rawMessage, meta, purpose, details } = req.body;
    const detailsObj = (() => {
      try {
        return typeof details === 'string' ? JSON.parse(details) : details || {};
      } catch (e) {
        return { _raw: details };
      }
    })();

    const message = rawMessage || purpose || detailsObj?.message || detailsObj?.title || '';
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const metaToStore = meta ? meta : (Object.keys(detailsObj || {}).length ? detailsObj : null);
    const created = await prisma.logEntry.create({ data: { level, message, meta: metaToStore ? JSON.stringify(metaToStore) : null } });
    res.status(201).json(created);
  } catch (e) {
    console.error('POST /api/logs error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Ensure DB connection before starting the server
(async () => {
  const ok = await ensureConnection();
  if (!ok) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Warning: Could not connect to database on startup.');
    console.warn('Check DATABASE_URL environment variable and Supabase status.');
    console.warn('Server will still start; database queries will fail until connection is established.');
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
