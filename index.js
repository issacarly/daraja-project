const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/client');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Daraja LMS API running!' }));

app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});