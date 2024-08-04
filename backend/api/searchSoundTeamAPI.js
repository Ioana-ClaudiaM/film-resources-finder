const express = require('express');
const router = express.Router();
const  {pool}=require('./database');
const searchCache5 = {};

async function searchInCacheOrDatabase5(searchTerm) {
    if (searchTerm in searchCache5) {
        return searchCache5[searchTerm];
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            const query = `
            SELECT * 
            FROM echipe_sunet
            WHERE descriere LIKE ?`;

            const results = await conn.query(query, [`%${searchTerm}%`]);

            searchCache5[searchTerm] = results;
            return results;
        
        } catch (error) {
            console.error('Eroare la căutare:', error);
            throw error;
        } finally {
            if (conn) {
                conn.release(); 
            }
        }
    }
}

router.get('/searchEchipaSunet', async (req, res) => {
    const searchTerm = req.query.term;
    try {
        const results = await searchInCacheOrDatabase5(searchTerm);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la căutare' });
    }
});

module.exports=router;