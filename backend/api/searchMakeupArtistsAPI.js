const express = require('express');
const router = express.Router();
const  {pool}=require('./database');
const fs = require('fs');
const sharp = require('sharp');
const searchCache3 = {};

async function searchInCacheOrDatabase3(searchTerm) {
    if (searchTerm in searchCache3) {
        return searchCache3[searchTerm];
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            const query = `
            SELECT * 
            FROM makeupArtists
            WHERE descriere LIKE ?`;

            const results = await conn.query(query, [`%${searchTerm}%`]);
            searchCache3[searchTerm] = results;
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

router.get('/searchMakeupArtist', async (req, res) => {
    const searchTerm = req.query.term;
    try {
        const results = await searchInCacheOrDatabase3(searchTerm);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la căutare' });
    }
});



const imageDirectory3 = '../src/Styles/ImaginiMakeup';

const compressAndInsertImage3 = async (makeupArtistName, imagePath, conn) => {
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

            const queryMakeupArtistId = 'SELECT id FROM makeupArtists WHERE nume = ?';
            const makeupArtistIdResults = await conn.query(queryMakeupArtistId, [makeupArtistName]);

            if (makeupArtistIdResults.length === 0) {
                console.error(`Makeup artistul cu numele '${makeupArtistName}' nu a fost găsit în baza de date.`);
                return;
            }

            const makeupArtistId = makeupArtistIdResults[0].id;

            const queryInsertImage = 'UPDATE makeupArtists SET imagine = ? WHERE id = ?';
            await conn.query(queryInsertImage, [compressedImageBuffer, makeupArtistId]);

        });
    } catch (error) {
        console.error('Eroare la comprimarea și inserarea imaginii:', error);
    }
};

fs.readdir(imageDirectory3, async (err, files) => {
    if (err) {
        console.error('Eroare la citirea directorului:', err);
        return;
    }

    if (files.length === 0) {
        console.error('Nu s-au găsit fișiere în directorul specificat:', imageDirectory3);
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        for (const file of files) {
            const makeupArtistName = file.split('.')[0]; 
            const imagePath = `${imageDirectory3}/${file}`; 

            await compressAndInsertImage3(makeupArtistName, imagePath, conn);
        }
    } catch (error) {
        console.error('Eroare la conectarea sau interogarea bazei de date:', error);
    } finally {
    }
});

router.get('/getImageArtist/:makeupArtistName', async (req, res) => {
    const makeupArtistName = req.params.makeupArtistName;

    let conn;
    try {
        conn = await pool.getConnection();

        const queryImage = 'SELECT imagine FROM makeupArtists WHERE nume = ?';
        const result = await conn.query(queryImage, [makeupArtistName]);

        if (result.length === 0 || !result[0].imagine) {
            return res.status(404).json({ error: 'Imaginea nu a fost găsită pentru acest artist.' });
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

module.exports=router;