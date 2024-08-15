// server.js

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const port = 3000;

const app = express();

app.use(express.json());
app.use('/auths', userRoutes);

connectDB();

app.listen(port, () => {
  console.log(`RentEasy app listening at http://localhost:${port}`);
});