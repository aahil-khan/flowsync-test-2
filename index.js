const express = require('express');
const app = express();

app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/tasks', require('./routes/tasks'));

app.listen(3000, () => console.log('Server running'));
