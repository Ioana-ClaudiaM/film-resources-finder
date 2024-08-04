const express = require('express');
const router = express.Router();
const  {pool}=require('./database');

router.get('/get-description/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT description FROM description WHERE id_utilizator = ?', [id]);
        conn.release();

        if (result.length > 0) {
            const description = result[0].description;
            res.json({ description: description }); 
        } else {
            res.status(404).json({ error: 'Descrierea pentru utilizatorul specificat nu a fost găsită.' });
        }
    } catch (error) {
        console.error('Error while fetching description from database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/update-description', async (req, res) => {
    const { id, description } = req.body;

    try {
        const conn = await pool.getConnection();
        const existingDescriptionResult = await conn.query('SELECT * FROM description WHERE id_utilizator = ?', [id]);
        if (existingDescriptionResult && existingDescriptionResult.length > 0) {
            await conn.query('UPDATE description SET description = ? WHERE id_utilizator = ?', [description, id]);
            res.json({ message: 'Descrierea a fost actualizată cu succes.' });
        } else {
            await conn.query('INSERT INTO description (id_utilizator, description) VALUES (?, ?)', [id, description]);
            res.json({ message: 'Descrierea a fost adăugată cu succes.' });
        }

        conn.release();
    } catch (error) {
        console.error('Error while updating description in database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports=router;