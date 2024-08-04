const express = require('express');
const router = express.Router();
const { pool } = require('./database');

router.get('/get-existing-languages', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const languages = await conn.query('SELECT * FROM languages');
        const languageData = languages.map(language => ({
            name: language.name,
            level: language.level,
        }));
        res.json({ languages: languageData });
        conn.release();
    } catch (error) {
        console.error('Error while getting existing languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-languages/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const conn = await pool.getConnection();
        const languages = await conn.query('SELECT * FROM languages WHERE id_utilizator = ?', [id]);
        const languagesData = languages.map(language => ({
            name: language.name,
            level: language.level,
        }));
        res.json({ languages: languagesData });
        conn.release();
    } catch (error) {
        console.error('Error while getting existing languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add-languages-info', async (req, res) => {
    const { id, languages } = req.body;

    try {
        const conn = await pool.getConnection();

        for (const language of languages) {
            const [existingLanguage] = await conn.query(
                'SELECT * FROM languages WHERE id_utilizator = ? AND name = ?',
                [id, language.name]
            );

            if (existingLanguage) {
                await conn.query(
                    'UPDATE languages SET level = ? WHERE id_utilizator = ? AND name = ?',
                    [language.level, id, language.name]
                );
            } else {
                await conn.query(
                    'INSERT INTO languages (id_utilizator, name, level) VALUES (?, ?, ?)',
                    [id, language.name, language.level]
                );
            }
        }

        conn.release();
        res.status(200).json({ message: 'Languages added/updated successfully.' });
    } catch (error) {
        console.error('Error adding languages to database:', error);
        res.status(500).json({ error: 'An error occurred while adding languages.' });
    }
});

router.delete('/delete-language', async (req, res) => {
    const { name } = req.body;

    try {
        const conn = await pool.getConnection();
        await conn.query('DELETE FROM languages WHERE name = ?', [name]);
        conn.release();
        res.json({ message: 'Language was successfully deleted' });
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
