const express = require('express');
const router = express.Router();
const { pool } = require('./database');

router.get('/get-roluri/:filmId', async (req, res) => {
    const filmId = req.params.filmId; 
    try {
        const conn = await pool.getConnection();
        const roluri = await conn.query('SELECT * FROM Roluri WHERE id_film = ?', [filmId]);
        conn.release();
        res.json(roluri);
        console.log(roluri);
    } catch (error) {
        console.error('Eroare la obținerea rolurilor:', error);
        res.status(500).json({ error: 'Eroare la obținerea rolurilor' });
    }
});

router.put('/update-role/:filmId/:roleId', async (req, res) => {
    const roleId = req.params.roleId;
    const { titlu, sex, varsta, experienta, etnie, descriere } = req.body; 

    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query("SELECT * FROM Roluri WHERE id_rol = ?", [roleId]);

        if (result.length === 0) {
            conn.release();
            return res.status(404).json({ error: 'Rolul nu a fost găsit.' });
        }
        await conn.query("UPDATE Roluri SET titlu = ?, sex = ?, varsta = ?, experienta = ?, etnie = ?, descriere = ? WHERE id_rol = ?", [titlu, sex, varsta, experienta, etnie, descriere, roleId]);
        conn.release();

        res.status(200).json({ message: 'Rolul a fost actualizat cu succes.' });
    } catch (error) {
        console.error('Eroare la actualizarea rolului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.get('/get-role/:filmId/:roleId', async (req, res) => {
    try {
        const { filmId, roleId } = req.params; 

        const conn = await pool.getConnection();
        const [role] = await conn.query("SELECT * FROM Roluri WHERE id_film = ? AND id_rol = ?", [filmId, roleId]); 

        conn.release();

        if (role.length > 0) {
            res.json(role[0]);
        } else {
            res.status(404).json({ error: 'Rolul nu a fost găsit.' }); 
        }
    } catch (error) {
        console.error('Eroare la obținerea detaliilor rolului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

module.exports = router;
