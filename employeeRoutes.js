const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM [dbo].[EmployeeDetails]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET employee by Name
router.get('/name/:name', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.VarChar, req.params.name)
            .query('SELECT * FROM [dbo].[EmployeeDetails] WHERE Name IS NOT NULL AND LOWER(Name) = LOWER(@name)');

        if (result.recordset.length === 0) {
            return res.status(404).send('Employee not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM [dbo].[EmployeeDetails] WHERE ID = @id');

        if (result.recordset.length === 0) {
            return res.status(404).send('Employee not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// POST new employee — returns inserted ID
router.post('/', async (req, res) => {
    try {
        const { Name, DOB, Address, Contact_Number } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('DOB', sql.Date, DOB)
            .input('Address', sql.NVarChar, Address)
            .input('Contact_Number', sql.NVarChar, Contact_Number)
            .query(`
                INSERT INTO [dbo].[EmployeeDetails] (Name, DOB, Address, Contact_Number)
                VALUES (@Name, @DOB, @Address, @Contact_Number);

                SELECT SCOPE_IDENTITY() AS ID;
            `);

        const insertedId = result.recordset[0].ID;

        res.status(201).json({
            ID: insertedId,
            Name,
            DOB,
            Address,
            Contact_Number
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT update employee
router.put('/:id', async (req, res) => {
    try {
        const { Name, DOB, Address, Contact_Number } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('Name', sql.NVarChar, Name)
            .input('DOB', sql.Date, DOB)
            .input('Address', sql.NVarChar, Address)
            .input('Contact_Number', sql.NVarChar, Contact_Number)
            .query(`
                UPDATE [dbo].[EmployeeDetails]
                SET Name = @Name, DOB = @DOB, Address = @Address, Contact_Number = @Contact_Number
                WHERE ID = @id;
            `);

        res.send('Employee updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM [dbo].[EmployeeDetails] WHERE ID = @id');
        res.send('Employee deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
