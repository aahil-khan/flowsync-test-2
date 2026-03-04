require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const app = express();

connectDB();

app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/user'));
app.use('/tasks', require('./routes/tasks'));

// 404 and error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
