const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.institution.findMany({
  where: {
    name: {
      contains: 'mwam'
    }
  }
}).then(i => console.log(i)).finally(() => prisma.$disconnect());


