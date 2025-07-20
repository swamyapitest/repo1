const express = require('express');
const bodyParser = require('body-parser');
const employeeRoutes = require('./employeeRoutes');
const auth = require('./authMiddleware');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());


app.use(auth);

app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
