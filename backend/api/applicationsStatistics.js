const express = require('express');
const router = express.Router();
const { pool } = require('./database');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();

router.get('/total-applications', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('SELECT COUNT(*) as totalApplications FROM aplicari');
        res.json(result.map(row => ({
            totalApplications: Number(row.totalApplications)
        })));
    } catch (error) {
        console.error('Error fetching total applications:', error);
        res.status(500).send('Error fetching total applications');
    } finally {
        if (conn) conn.release();
    }
});

router.get('/applications-trend', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(`
            SELECT DATE_FORMAT(data_inregistrare, '%Y-%m-%d') as date, COUNT(*) as totalApplications
            FROM aplicari
            GROUP BY date
            ORDER BY date
        `);
        res.json(result.map(row => ({
            date: row.date,
            totalApplications: Number(row.totalApplications)
        })));
    } catch (error) {
        console.error('Error fetching applications trend:', error);
        res.status(500).send('Error fetching applications trend');
    } finally {
        if (conn) conn.release();
    }
});



router.get('/acceptance-rate', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(`
            SELECT 
                (SELECT COUNT(*) FROM aplicari WHERE status = 'Acceptata') / COUNT(*) * 100 AS acceptanceRate
            FROM aplicari
        `);
        res.json({ acceptanceRate: Number(result[0].acceptanceRate) });
    } catch (error) {
        console.error('Error fetching acceptance rate:', error);
        res.status(500).send('Error fetching acceptance rate');
    } finally {
        if (conn) conn.release();
    }
});


router.get('/average-time-to-decision', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT TIMESTAMPDIFF(DAY, data_inregistrare, data_rezolutie) as timeToDecision, data_inregistrare, data_rezolutie
            FROM aplicari
            WHERE status IN ('Acceptata', 'Respinsa') AND data_rezolutie IS NOT NULL
        `;
        const result = await conn.query(query);

        const avgResult = await conn.query(`
            SELECT AVG(TIMESTAMPDIFF(DAY, data_inregistrare, data_rezolutie)) as avgTimeToDecision
            FROM aplicari
            WHERE status IN ('Acceptata', 'Respinsa') AND data_rezolutie IS NOT NULL
        `);
        res.json(avgResult.map(row => ({
            avgTimeToDecision: Number(row.avgTimeToDecision)
        })));
    } catch (error) {
        console.error('Error fetching average time to decision:', error);
        res.status(500).send('Error fetching average time to decision');
    } finally {
        if (conn) conn.release();
    }
});


router.get('/applications-trend', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(`
            SELECT DATE(data_inregistrare) as date, COUNT(*) as totalApplications
            FROM aplicari
            GROUP BY date
            ORDER BY date
        `);
        res.json(result.map(row => ({
            date: row.date,
            totalApplications: Number(row.totalApplications)
        })));
    } catch (error) {
        console.error('Error fetching applications trend:', error);
        res.status(500).send('Error fetching applications trend');
    } finally {
        if (conn) conn.release();
    }
});

router.get('/applications-per-film', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query(`
            SELECT f.titlu, COUNT(*) as totalApplications
            FROM aplicari a
            JOIN Film f ON a.id_film = f.id_film
            GROUP BY f.titlu
        `);
        const applicationsPerFilm = results.map(row => ({
            film: row.titlu,
            totalApplications: Number(row.totalApplications) 
        }));
        res.json(applicationsPerFilm);
    } catch (error) {
        console.error('Error fetching applications per film:', error);
        res.status(500).send('Error fetching applications per film');
    } finally {
        if (conn) conn.release();
    }
});

router.get('/applications-per-actor', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(`
            SELECT u.nume as actor, COUNT(*) as totalApplications
            FROM aplicari a
            JOIN Utilizatori u ON a.id_utilizator = u.id_utilizator
            GROUP BY actor
            ORDER BY totalApplications DESC
        `);
        res.json(result.map(row => ({
            actor: row.actor,
            totalApplications: Number(row.totalApplications)
        })));
    } catch (error) {
        console.error('Error fetching applications per actor:', error);
        res.status(500).send('Error fetching applications per actor');
    } finally {
        if (conn) conn.release();
    }
});

router.get('/top-films', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query(`
            SELECT titlu as name, COUNT(*) as totalApplications
            FROM aplicari a
            JOIN Film f ON a.id_film = f.id_film
            GROUP BY f.id_film
            ORDER BY totalApplications DESC
            LIMIT 5
        `);
        const topFilms = results.map(row => ({
            name: row.name,
            totalApplications: Number(row.totalApplications) 
        }));
        res.json(topFilms);
    } catch (error) {
        console.error('Error fetching top films:', error);
        res.status(500).send('Error fetching top films');
    } finally {
        if (conn) conn.release();
    }
});

router.get('/top-roles', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query(`
            SELECT rol as name, COUNT(*) as totalApplications
            FROM aplicari a
            JOIN Roluri r ON a.rol = r.titlu
            GROUP BY r.id_rol
            ORDER BY totalApplications DESC
            LIMIT 5
        `);
        const topRoles = results.map(row => ({
            name: row.name,
            totalApplications: Number(row.totalApplications) 
        }));
        res.json(topRoles);
    } catch (error) {
        console.error('Error fetching top roles:', error);
        res.status(500).send('Error fetching top roles');
    } finally {
        if (conn) conn.release();
    }
});

  router.get('/user-count-by-county', async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(`
        SELECT judet, tip_utilizator, CAST(COUNT(*) AS UNSIGNED) as count
        FROM utilizatori
        GROUP BY judet, tip_utilizator
      `);

      const data = result.reduce((acc, row) => {
        if (!acc[row.judet]) {
          acc[row.judet] = { Actor: 0, Producator: 0 };
        }
        acc[row.judet][row.tip_utilizator] = Number(row.count);
        return acc;
      }, {});
  
      res.json(data);
    } catch (error) {
      console.error('Error fetching user count by county:', error);
      res.status(500).send('Error fetching user count by county');
    } finally {
      if (conn) conn.release();
    }
  });
  
  
  
module.exports=router;