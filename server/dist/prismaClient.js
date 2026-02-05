"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConnection = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ensureConnection = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        console.log('✅ Database connected successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
exports.ensureConnection = ensureConnection;
exports.default = prisma;
