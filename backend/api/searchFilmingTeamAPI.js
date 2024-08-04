const express = require('express');
const router = express.Router();
const  {pool}=require('./database');
const searchCache4 = {};

async function searchInCacheOrDatabase4(searchTerm) {
    if (searchTerm in searchCache4) {
        return searchCache4[searchTerm];
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            const query = `
            SELECT * 
            FROM echipe_filmare
            WHERE descriere LIKE ?`;

            const results = await conn.query(query, [`%${searchTerm}%`]);
            searchCache4[searchTerm] = results;
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

router.get('/searchEchipaFilmare', async (req, res) => {
    const searchTerm = req.query.term;
    try {
        const results = await searchInCacheOrDatabase4(searchTerm);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la căutare' });
    }
});

module.exports=router;