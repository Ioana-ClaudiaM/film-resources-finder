const express = require('express');
const router = express.Router();
const {pool} = require('./database');

router.get('/get-existing-skills', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const skills = await conn.query('SELECT * FROM skills'); 
        conn.release(); 
        const skillNames = skills.map(skill => skill.name);
        res.json({ skills: skillNames });
    } catch (error) {
        console.error('Error while getting existing skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add-skills-info', async (req, res) => {
    const { id, skills } = req.body;

    try {
        const conn = await pool.getConnection();
        for (const skill of skills) {
            const existingSkill = await conn.query(
                'SELECT * FROM skills WHERE id_utilizator = ? AND name = ?',
                [id, skill.name]
            );
            if (existingSkill.length === 0) {
                await conn.query(
                    'INSERT INTO skills (id_utilizator, name, level) VALUES (?, ?, ?)',
                    [id, skill.name, skill.level]
                );
            } else {
                await conn.query(
                    'UPDATE skills SET level = ? WHERE id_utilizator = ? AND name = ?',
                    [skill.level, id, skill.name]
                );
            }
        }

        conn.release();
        res.status(200).json({ message: 'Skills added/updated successfully.' });
    } catch (error) {
        console.error('Error adding skills to database:', error);
        res.status(500).json({ error: 'An error occurred while adding skills.' });
    }
});

router.get('/get-skills/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const conn = await pool.getConnection();
        const skills = await conn.query('SELECT * FROM skills WHERE id_utilizator = ?', [id]);
        conn.release();

        res.json({ skills: skills }); 
    } catch (error) {
        console.error('Eroare la obținerea abilităților utilizatorului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului' });
    }
});

router.delete('/delete-skill', async (req, res) => {
    const { name } = req.body;

    try {
        const conn = await pool.getConnection();
        await conn.query('DELETE FROM skills WHERE name = ?', [name]); 
        conn.release();

        res.json({ message: 'Skill-ul a fost șters cu succes' }); 
    } catch (error) {
        console.error('Eroare la ștergerea skill-ului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului' });
    }
});

module.exports = router;
