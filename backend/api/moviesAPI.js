const express = require('express');
const router = express.Router();
const { pool } = require('./database');

router.post('/postare-film', async (req, res) => {
    const { titlu, descriere, gen, roluri, userId } = req.body; 
    try {
        const conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO film (titlu, descriere, gen, id_producator) VALUES (?, ?, ?, ?)", [titlu, descriere, gen, userId]);
        const filmId = result.insertId;

        for (const rol of roluri) {
            await conn.query("INSERT INTO roluri (id_film, titlu, sex, varsta, experienta, etnie, descriere) VALUES (?, ?, ?, ?, ?, ?, ?)", [filmId, rol.title, rol.sex, rol.age, rol.experience, rol.ethnicity, rol.descriere]);
        }

        conn.release();

        res.status(200).json({ message: 'Detaliile filmului au fost salvate cu succes!' });
    } catch (error) {
        console.error('Eroare la salvarea filmului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.delete('/delete-film/:filmId', async (req, res) => {
    const filmId = req.params.filmId;
    try {
        const conn = await pool.getConnection();
        await conn.query("DELETE FROM roluri WHERE id_film = ?", [filmId]);
        await conn.query("DELETE FROM film WHERE id_film = ?", [filmId]);

        conn.release();
        res.status(200).json({ message: 'Filmul și rolurile asociate au fost șterse cu succes!' });
    } catch (error) {
        console.error('Eroare la ștergerea filmului și a rolurilor:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.put('/update-film/:filmId', async (req, res) => {
    const filmId = req.params.filmId;
    const { titlu, descriere, gen, roluri, userId } = req.body;

    try {
        const conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM film WHERE id_film = ? AND id_producator = ?", [filmId, userId]);
        conn.release();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Filmul nu a fost găsit sau nu aparține utilizatorului.' });
        }
        const conn2 = await pool.getConnection();
        await conn2.query("UPDATE film SET titlu = ?, descriere = ?, gen = ? WHERE id_film = ?", [titlu, descriere, gen, filmId]);

        conn2.release();

        res.status(200).json({ message: 'Filmul a fost actualizat cu succes.' });
    } catch (error) {
        console.error('Eroare la actualizarea filmului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.get('/get-filme/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        const conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM film WHERE id_producator = ?", [id]); 

        for (let i = 0; i < result.length; i++) {
            const filmId = result[i].id_film;
            const roluri = await conn.query("SELECT * FROM roluri WHERE id_film = ?", [filmId]);
            result[i].roluri = roluri;
            result[i].genuri = result[i].gen.split(', '); 
        }

        conn.release();
        res.json(result); 
    } catch (error) {
        console.error('Eroare la obținerea listei de filme:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.get('/get-filme', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const result = await conn.query(`
            SELECT f.*, p.nume AS producator
            FROM film f
            JOIN utilizatori p ON f.id_producator = p.id_utilizator
        `);

        for (let i = 0; i < result.length; i++) {
            const filmId = result[i].id_film;
            const roluri = await conn.query("SELECT * FROM roluri WHERE id_film = ?", [filmId]);
            result[i].roluri = roluri;
            result[i].genuri = result[i].gen.split(', '); 
        }

        conn.release();
        res.json(result); 
    } catch (error) {
        console.error('Eroare la obținerea listei de filme:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.get('/film/:titlu/roluri', async (req, res) => {
    const titlu = req.params.titlu;
    try {
        const conn = await pool.getConnection();
        const idResult = await conn.query('SELECT id_film FROM film WHERE titlu=?', [titlu]);
        const id_film = idResult[0].id_film; 
        const results = await conn.query('SELECT * FROM roluri WHERE id_film=?', [id_film]);

        conn.release();
        res.json(results);
    } catch (err) {
        console.error('Error retrieving roles:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
