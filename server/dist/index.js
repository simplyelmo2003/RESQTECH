"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importStar(require("./prismaClient"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Request logging middleware for debugging incoming requests
app.use((req, res, next) => {
    try {
        const safeBody = (() => {
            try {
                return JSON.stringify(req.body);
            }
            catch {
                return '[unserializable]';
            }
        })();
        console.log(`➡️ ${req.method} ${req.originalUrl} — body: ${safeBody}`);
    }
    catch (e) {
        console.log('➡️ request logging error', e);
    }
    next();
});
const PORT = process.env.PORT || 4000;
app.get('/api/health', async (_req, res) => {
    try {
        // Check DB connectivity as part of health
        await prismaClient_1.default.$queryRaw `SELECT 1`;
        return res.json({ status: 'ok', db: 'ok', now: new Date().toISOString() });
    }
    catch (e) {
        return res.status(503).json({ status: 'degraded', db: 'unavailable', error: String(e) });
    }
});
// Incident reports
app.get('/api/incident-reports', async (_req, res) => {
    try {
        const reports = await prismaClient_1.default.incidentReport.findMany({ orderBy: { createdAt: 'desc' } });
        console.log('📤 GET /api/incident-reports: returning', reports.length, 'reports');
        if (reports.length > 0) {
            console.log('   First report:', { id: reports[0].id, reporterName: reports[0].reporterName, type: reports[0].type });
        }
        res.json(reports);
    }
    catch (e) {
        console.error('GET /api/incident-reports error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Debug endpoint - get most recent report
app.get('/api/incident-reports/debug/latest', async (_req, res) => {
    try {
        const latest = await prismaClient_1.default.incidentReport.findFirst({ orderBy: { createdAt: 'desc' } });
        res.json(latest || { message: 'No reports yet' });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/incident-reports', async (req, res) => {
    try {
        console.log('📥 POST /api/incident-reports received:', JSON.stringify(req.body));
        const { reporterName, reporterContact, type, description, locationDescription, latitude, longitude, barangayId } = req.body;
        console.log('🔍 Extracted fields:', {
            reporterName,
            reporterContact,
            type,
            description,
            locationDescription,
            latitude,
            longitude,
            // imageUrls removed
            barangayId
        });
        // Validate required fields
        if (!description || !type) {
            console.warn('⚠️ Missing required fields: description or type');
            return res.status(400).json({ error: 'Missing required fields: description, type' });
        }
        const created = await prismaClient_1.default.incidentReport.create({
            data: {
                reporterName: reporterName || 'Anonymous',
                reporterContact: reporterContact || null,
                type: type || 'Other',
                description: description || '',
                locationDescription: locationDescription || null,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
                // imageUrls removed
                status: 'Pending',
                barangayId: barangayId || null,
            }
        });
        console.log('✅ Incident report created:', created.id);
        res.status(201).json(created);
    }
    catch (e) {
        console.error('❌ POST /api/incident-reports error:', e);
        res.status(500).json({ error: 'Failed to create incident report', details: String(e) });
    }
});
// Update incident report (PUT)
app.put('/api/incident-reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, description, type, locationDescription } = req.body;
        console.log('📥 PUT /api/incident-reports/:id received:', { id, status, adminNotes });
        const updated = await prismaClient_1.default.incidentReport.update({
            where: { id },
            data: {
                status: status || undefined,
                adminNotes: adminNotes || undefined,
                description: description || undefined,
                type: type || undefined,
                locationDescription: locationDescription || undefined,
                updatedAt: new Date(),
            }
        });
        console.log('✅ Incident report updated:', updated.id, 'new status:', updated.status);
        res.json(updated);
    }
    catch (e) {
        console.error('❌ PUT /api/incident-reports/:id error:', e);
        res.status(500).json({ error: 'Failed to update incident report', details: String(e) });
    }
});
// Delete incident report
app.delete('/api/incident-reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📥 DELETE /api/incident-reports/:id received:', id);
        const deleted = await prismaClient_1.default.incidentReport.delete({ where: { id } });
        console.log('🗑️ Incident report deleted:', deleted.id);
        res.json({ success: true, id: deleted.id });
    }
    catch (e) {
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
        const msgs = await prismaClient_1.default.message.findMany({ orderBy: { createdAt: 'asc' } });
        res.json(msgs);
    }
    catch (e) {
        console.error('GET /api/messages error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/messages', async (req, res) => {
    try {
        const { conversationId, sender, body } = req.body;
        const created = await prismaClient_1.default.message.create({ data: { conversationId, sender, body } });
        res.status(201).json(created);
    }
    catch (e) {
        console.error('POST /api/messages error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Evac centers
app.get('/api/evac-centers', async (_req, res) => {
    try {
        const centers = await prismaClient_1.default.evacCenter.findMany();
        res.json(centers);
    }
    catch (e) {
        console.error('GET /api/evac-centers error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/evac-centers', async (req, res) => {
    try {
        const { name, address, lat, lng, barangayId, contact, capacity, currentOccupancy, status, services, imageUrl } = req.body;
        const created = await prismaClient_1.default.evacCenter.create({
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
    }
    catch (e) {
        console.error('POST /api/evac-centers error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.put('/api/evac-centers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, lat, lng, barangayId, contact, capacity, currentOccupancy, status, services } = req.body;
        const updated = await prismaClient_1.default.evacCenter.update({
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
    }
    catch (e) {
        console.error('PUT /api/evac-centers/:id error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.delete('/api/evac-centers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await prismaClient_1.default.evacCenter.delete({ where: { id } });
        res.json(deleted);
    }
    catch (e) {
        console.error('DELETE /api/evac-centers/:id error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Alerts
app.get('/api/alerts', async (_req, res) => {
    try {
        const alerts = await prismaClient_1.default.alert.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(alerts);
    }
    catch (e) {
        console.error('GET /api/alerts error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/alerts', async (req, res) => {
    try {
        const { title, description, areaAffected } = req.body;
        const created = await prismaClient_1.default.alert.create({ data: { title, description, areaAffected } });
        res.status(201).json(created);
    }
    catch (e) {
        console.error('POST /api/alerts error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// News
app.get('/api/news', async (_req, res) => {
    try {
        const items = await prismaClient_1.default.news.findMany({ orderBy: { publishedAt: 'desc' } });
        console.log('📰 GET /api/news: found', items.length, 'items');
        if (items.length > 0) {
            console.log('   First item:', { id: items[0].id, title: items[0].title });
        }
        res.json(items);
    }
    catch (e) {
        console.error('GET /api/news error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/news', async (req, res) => {
    try {
        console.log('📝 POST /api/news received:', JSON.stringify(req.body, null, 2));
        const { title, content, category, mediaType, mediaUrl, thumbnailUrl, author, source } = req.body;
        // Validation
        if (!title || !content) {
            console.error('POST /api/news validation error: missing title or content', { title, content });
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const created = await prismaClient_1.default.news.create({
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
        console.log('✅ News item created:', created.id);
        res.status(201).json(created);
    }
    catch (e) {
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
        const created = await prismaClient_1.default.news.create({
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
    }
    catch (e) {
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
        const created = await prismaClient_1.default.news.create({
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
    }
    catch (e) {
        console.error('POST /admin/news error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Contacts
app.get('/api/contacts', async (_req, res) => {
    try {
        const contacts = await prismaClient_1.default.contact.findMany();
        console.log('📇 GET /api/contacts: found', contacts.length, 'contacts');
        if (contacts.length > 0) {
            console.log('   First contact:', { id: contacts[0].id, name: contacts[0].name });
        }
        res.json(contacts);
    }
    catch (e) {
        console.error('GET /api/contacts error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/contacts', async (req, res) => {
    try {
        const { name, organization, phoneNumber, type, description } = req.body;
        const created = await prismaClient_1.default.contact.create({ data: { name, organization, phoneNumber, type, description } });
        res.status(201).json(created);
    }
    catch (e) {
        console.error('POST /api/contacts error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, organization, phoneNumber, type, description } = req.body;
        const updated = await prismaClient_1.default.contact.update({
            where: { id },
            data: { name, organization, phoneNumber, type, description }
        });
        res.json(updated);
    }
    catch (e) {
        console.error('PUT /api/contacts/:id error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await prismaClient_1.default.contact.delete({ where: { id } });
        res.json(deleted);
    }
    catch (e) {
        console.error('DELETE /api/contacts/:id error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Users (basic list/create for admin tooling)
app.get('/api/users', async (_req, res) => {
    try {
        const users = await prismaClient_1.default.user.findMany();
        res.json(users);
    }
    catch (e) {
        console.error('GET /api/users error:', e);
        res.status(500).json({ error: String(e) });
    }
});
app.post('/api/users', async (req, res) => {
    try {
        const { username, password, role, barangayId } = req.body;
        const created = await prismaClient_1.default.user.create({ data: { username, password, role, barangayId } });
        res.status(201).json(created);
    }
    catch (e) {
        console.error('POST /api/users error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Logs
app.get('/api/logs', async (_req, res) => {
    try {
        const logs = await prismaClient_1.default.logEntry.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(logs);
    }
    catch (e) {
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
            }
            catch (e) {
                return { _raw: details };
            }
        })();
        const message = rawMessage || purpose || detailsObj?.message || detailsObj?.title || '';
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const metaToStore = meta ? meta : (Object.keys(detailsObj || {}).length ? detailsObj : null);
        const created = await prismaClient_1.default.logEntry.create({ data: { level, message, meta: metaToStore ? JSON.stringify(metaToStore) : null } });
        res.status(201).json(created);
    }
    catch (e) {
        console.error('POST /api/logs error:', e);
        res.status(500).json({ error: String(e) });
    }
});
// Ensure DB connection before starting the server
(async () => {
    const ok = await (0, prismaClient_1.ensureConnection)();
    if (!ok) {
        // eslint-disable-next-line no-console
        console.error('Failed to connect to the database after multiple attempts; exiting.');
        process.exit(1);
    }
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();
