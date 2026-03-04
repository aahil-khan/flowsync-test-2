require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/tasks', require('./routes/tasks'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
