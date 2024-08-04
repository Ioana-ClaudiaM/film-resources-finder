const express = require('express');
const router = express.Router();
const { pool } = require('./database');

router.get('/get-existing-educations', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const educations = await conn.query('SELECT * FROM education');
        const educationData = educations.map(education => ({
            type: education.type,
            name: education.name,
            location: education.location,
            description: education.description,
            startYear: education.start_year,
            endYear: education.end_year
        }));
        res.json({ educations: educationData });
        conn.release();
    } catch (error) {
        console.error('Error while getting existing educations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-education/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const conn = await pool.getConnection();
        const educations = await conn.query('SELECT * FROM education WHERE id_utilizator = ?', [id]);
        const educationsData = educations.map(education => ({
            type: education.type,
            name: education.name,
            location: education.location,
            description: education.description,
            startYear: education.start_year,
            endYear: education.end_year
        }));
        res.json({ educations: educationsData });
        conn.release();
    } catch (error) {
        console.error('Error while getting existing educations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add-educations-info', async (req, res) => {
    const { id, educations } = req.body;

    if (!id || !educations || educations.length === 0) {
        return res.status(400).json({ error: 'Invalid data provided.' });
    }

    try {
        const conn = await pool.getConnection();

        for (const education of educations) {
            const [existingEducation] = await conn.query(
                'SELECT * FROM education WHERE id_utilizator = ? AND name = ? AND start_year = ? AND end_year = ?',
                [id, education.name, education.startYear, education.endYear]
            );

            if (!existingEducation) {
                await conn.query(
                    'INSERT INTO education (id_utilizator, type, name, location, description, start_year, end_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [id, education.type, education.name, education.location, education.description, education.startYear, education.endYear]
                );
            }
        }

        conn.release();
        res.status(200).json({ message: 'Educations added successfully.' });
    } catch (error) {
        console.error('Error adding educations to database:', error);
        res.status(500).json({ error: 'An error occurred while adding educations.' });
    }
});

router.delete('/delete-education', async (req, res) => {
    const { name } = req.body;

    try {
        const conn = await pool.getConnection();
        await conn.query('DELETE FROM education WHERE name = ?', [name]);
        conn.release();
        res.json({ message: 'Educația a fost ștearsă cu succes' });
    } catch (error) {
        console.error('Eroare la ștergerea educației:', error);
        res.status(500).json({ error: 'Eroare internă a serverului' });
    }
});

module.exports = router;
