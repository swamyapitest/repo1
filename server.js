const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./employeeRoutes');
const auth = require('./authMiddleware');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Optional: Serve static frontend (if applicable)
// app.use(express.static(path.join(__dirname, 'public')));

// Custom authentication middleware
app.use(auth);

// Mount employee routes
app.use('/api/employees', employeeRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
