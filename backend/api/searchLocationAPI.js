const express = require('express');
const router = express.Router();
const  {pool}=require('./database');
const fs = require('fs');
const sharp = require('sharp');

const searchCache = {};

async function searchInCacheOrDatabase(searchTerm) {
    if (searchTerm in searchCache) {
        return searchCache[searchTerm];
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            const query = `
            SELECT * 
            FROM locatii
            WHERE descriere LIKE ?`;
            const results = await conn.query(query, [`%${searchTerm}%`]);
            searchCache[searchTerm] = results;
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

router.get('/searchLocatie', async (req, res) => {
    const searchTerm = req.query.term;
    try {
      const results = await searchInCacheOrDatabase(searchTerm);
      res.json(results.map(result => ({
        id: result.id,
        nume: result.nume,
        descriere: result.descriere
      })));
    } catch (error) {
      res.status(500).json({ error: 'Eroare la căutare' });
    }
  });
  
const imageDirectory = '../src/Styles/ImaginiLocatii';

const compressAndInsertImage = async (locationName, imagePath, conn) => {
    try {
        fs.readFile(imagePath, async (err, imageBuffer) => {
            if (err) {
                console.error('Eroare la citirea imaginii:', err);
                return;
            }

            const compressedImageBuffer = await sharp(imageBuffer)
                .resize({ width: 800 }) 
                .jpeg({ quality: 80 }) 
                .toBuffer(); 

            const queryLocationId = 'SELECT id FROM locatii WHERE nume = ?';
            const locationIdResults = await conn.query(queryLocationId, [locationName]);

            if (locationIdResults.length === 0) {
                console.error(`Locația cu numele '${locationName}' nu a fost găsită în baza de date.`);
                return;
            }

            const locationId = locationIdResults[0].id;
            const queryInsertImage = 'UPDATE locatii SET imagine = ? WHERE id = ?';
            await conn.query(queryInsertImage, [compressedImageBuffer, locationId]);

        });
    } catch (error) {
        console.error('Eroare la comprimarea și inserarea imaginii:', error);
    }
};

fs.readdir(imageDirectory, async (err, files) => {
    if (err) {
        console.error('Eroare la citirea directorului:', err);
        return;
    }

    if (files.length === 0) {
        console.error('Nu s-au găsit fișiere în directorul specificat:', imageDirectory);
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        for (const file of files) {
            const locationName = file.split('.')[0]; 
            const imagePath = `${imageDirectory}/${file}`; 
            await compressAndInsertImage(locationName, imagePath, conn);
        }
    } catch (error) {
        console.error('Eroare la conectarea sau interogarea bazei de date:', error);
    } finally {
        if (conn) conn.release(); 
    }
});


router.get('/getImageLocation/:locationName', async (req, res) => {
    const locationName = req.params.locationName;

    let conn;
    try {
        conn = await pool.getConnection();
        const queryImage = 'SELECT imagine FROM locatii WHERE nume = ?';
        const result = await conn.query(queryImage, [locationName]);
        if (result.length === 0 || !result[0].imagine) {
            return res.status(404).json({ error: 'Imaginea nu a fost găsită pentru această locație.' });
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(result[0].imagine);

    } catch (error) {
        console.error('Eroare la extragerea și trimiterea imaginii:', error);
        res.status(500).json({ error: 'Eroare la extragerea și trimiterea imaginii.' });
    } finally {
        if (conn) conn.release(); 
    }
});

router.post('/saveLocation', async (req, res) => {
    const { userId, locationId } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();
        const queryInsert = 'INSERT INTO salvari (id_utilizator, locatie_id) VALUES (?, ?)';
        await conn.query(queryInsert, [userId, locationId]);
        const queryUpdate = 'UPDATE locatii SET numar_salvari = numar_salvari + 1 WHERE id = ?';
        await conn.query(queryUpdate, [locationId]);

        res.status(200).json({ message: 'Locația a fost salvată cu succes.' });
    } catch (error) {
        console.error('Eroare la salvarea locației:', error);
        res.status(500).json({ error: 'Eroare la salvarea locației.' });
    } finally {
        if (conn) conn.release();
    }
});

router.get('/getPopularLocations', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'SELECT * FROM locatii ORDER BY numar_salvari DESC';
        const results = await conn.query(query);
        res.json(results);
    } catch (error) {
        console.error('Eroare la obținerea locațiilor populare:', error);
        res.status(500).json({ error: 'Eroare la obținerea locațiilor populare.' });
    } finally {
        if (conn) conn.release();
    }
});


module.exports=router;
