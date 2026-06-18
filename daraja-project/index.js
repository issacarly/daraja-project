const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Daraja LMS API running!' }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});