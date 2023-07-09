const prisma = require("@prisma/client");

const client = new prisma.PrismaClient();

module.exports = client;
