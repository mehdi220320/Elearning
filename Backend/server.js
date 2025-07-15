const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const userRoutes = require('./user/user.routes')
const AuthRoutes = require('./auth/auth.routes')
mongoose.connect(process.env.Mongo_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', AuthRoutes)

app.listen(process.env.PORT, () => {
    console.log("Listening on port " + process.env.PORT);
});