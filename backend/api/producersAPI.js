const express = require('express');
const router = express.Router();
const { pool } = require('./database'); 

router.get('/get-producer-name/:id_producator', async (req, res) => {
  const { id_producator } = req.params;
  
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query('SELECT nume FROM utilizatori WHERE id_utilizator = ?', [id_producator]);
    
    if (result.length > 0) {
      res.json({ producerNume: result[0].nume });
    } else {
      res.status(404).json({ error: 'Producătorul nu a fost găsit' });
    }
  } catch (error) {
    console.error('Eroare la obținerea numelui producătorului:', error);
    res.status(500).json({ error: 'Eroare internă a serverului' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
