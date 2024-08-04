const express = require('express');
const router = express.Router();
const  {pool}=require('./database');

router.get('/get-user-details/:id', async (req, res) => {
    const id = req.params.id; 

    try {
        const conn = await pool.getConnection();
        const userDetails = await conn.query('SELECT * FROM userDetails WHERE id_utilizator = ?', [id]); 
        conn.release();

        if (userDetails.length > 0) {
            const userDetailsData = userDetails[0]; 
            res.json({ userDetails: userDetailsData });
        } else {
            res.status(404).json({ error: 'Detaliile utilizatorului nu au fost găsite.' });
        }
    } catch (error) {
        console.error('Error while getting existing user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/add-form-details-info', async (req, res) => {
    const { id, formData } = req.body;

    try {
        const conn = await pool.getConnection();
        const existingUserDetails = await conn.query('SELECT * FROM userDetails WHERE id_utilizator = ? AND nume = ? AND adresa = ? AND varsta = ?', [id, formData.nume, formData.adresa, formData.varsta]);
        if (existingUserDetails.length > 0) {
            console.log('Detalii utilizator existente în baza de date. Nu se poate adăuga duplicat.');
            res.status(400).json({ error: 'Detalii utilizator existente în baza de date.' });
            return;
        }

        await conn.query(
            'INSERT INTO userDetails (id_utilizator, name, telefon, varsta, adresa, ani_experienta, titlu_job) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, formData.nume, formData.telefon, formData.varsta, formData.adresa, formData.ani_experienta, formData.titlu_job]
        );

        await conn.release();
        res.status(200).json({ message: 'Detalii utilizator adăugate cu succes în baza de date.' });
    } catch (error) {
        console.error('Error adding user details to database:', error);
        res.status(500).json({ error: 'A apărut o eroare în timpul adăugării detaliilor utilizatorului în baza de date.' });
    }
});

router.post('/update-user-details/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        const conn = await pool.getConnection();

        const [existingUsers] = await conn.query('SELECT * FROM userdetails WHERE id_utilizator = ?', [id]);

        if (existingUsers && existingUsers.length > 0) {
            await conn.query('UPDATE userdetails SET nume=?, telefon=?, varsta=?, adresa=?, ani_experienta=?, titlu_job=? WHERE id_utilizator=?',
                [id, updatedData.nume, updatedData.telefon, updatedData.varsta, updatedData.adresa, updatedData.ani_experienta, updatedData.titlu_job]);
        } else {
            await conn.query('INSERT INTO userdetails (id_utilizator, nume, telefon, varsta, adresa, ani_experienta, titlu_job) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, updatedData.nume, updatedData.telefon, updatedData.varsta, updatedData.adresa, updatedData.ani_experienta, updatedData.titlu_job]);
        }

        conn.release();

        res.status(200).json({ message: 'Detaliile utilizatorului au fost actualizate cu succes.' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'A apărut o eroare în timpul actualizării detaliilor utilizatorului.' });
    }
});

module.exports=router;