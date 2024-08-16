// server.js

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const favorites = require('./routes/favoriteRoutes');
const search = require('./routes/searchRoutes');

const port = 3000;

const app = express();

app.use(express.json());
app.use('/auths', userRoutes);
app.use('/posts-content', postRoutes);
app.use('/favorites', favorites);
app.use('/search', search);

connectDB();

app.listen(port, () => {
  console.log(`RentEasy app listening at http://localhost:${port}`);
});