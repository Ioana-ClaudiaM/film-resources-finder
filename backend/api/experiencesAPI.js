const express = require('express');
const router = express.Router();
const { pool } = require('./database');

router.get('/get-existing-experiences', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const experiences = await conn.query('SELECT * FROM experiences');
        conn.release();
        const experiencesData = experiences.map(experience => ({
            id: experience.id,
            title: experience.title,
            start_year: experience.start_year,
            end_year: experience.end_year,
            location: experience.location,
            description: experience.description
        }));
        res.json({ experiences: experiencesData });
    } catch (error) {
        console.error('Error while getting existing experiences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add-experiences-info', async (req, res) => {
    const { id, experiences } = req.body;
    try {
      const conn = await pool.getConnection();
      for (const experience of experiences) {
        if (experience.startYear && experience.endYear) {
          const existingExperience = await conn.query(
            'SELECT * FROM experiences WHERE id_utilizator = ? AND title = ? AND start_year = ? AND end_year = ?',
            [id, experience.title, experience.startYear, experience.endYear]
          );
  
          if (existingExperience.length === 0) {
            await conn.query(
              'INSERT INTO experiences (id_utilizator, title, start_year, end_year, location, description) VALUES (?, ?, ?, ?, ?, ?)',
              [id, experience.title, experience.startYear, experience.endYear, experience.location, experience.description]
            );
          }
        } else {
          console.error('Start year or end year is missing:', experience);
        }
      }
      conn.release();
      res.status(200).json({ message: 'Experiences added successfully.' });
    } catch (error) {
      console.error('Error adding experiences to database:', error);
      res.status(500).json({ error: 'An error occurred while adding experiences.' });
    }
  });
  

router.get('/get-experiences/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const conn = await pool.getConnection();
        const experiences = await conn.query('SELECT * FROM experiences WHERE id_utilizator = ?', [id]);
        conn.release();
        const experiencesData = experiences.map(experience => ({
            id: experience.id,
            title: experience.title,
            start_year: experience.start_year,
            end_year: experience.end_year,
            location: experience.location,
            description: experience.description
        }));
        res.json({ experiences: experiencesData });
    } catch (error) {
        console.error('Error while getting user experiences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete-experience', async (req, res) => {
    const { id } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query('DELETE FROM experiences WHERE id = ?', [id]);
        conn.release();
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
