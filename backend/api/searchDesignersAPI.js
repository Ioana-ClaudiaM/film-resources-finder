const express = require('express');
const router = express.Router();
const  {pool}=require('./database');
const searchCache2 = {};
const fs = require('fs');
const sharp = require('sharp');

async function searchInCacheOrDatabase2(searchTerm) {
    if (searchTerm in searchCache2) {
        return searchCache2[searchTerm];
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            const query = `
            SELECT * 
            FROM designeri
            WHERE descriere LIKE ?`;
            const results = await conn.query(query, [`%${searchTerm}%`]);
            searchCache2[searchTerm] = results;
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

router.get('/searchDesigner', async (req, res) => {
    const searchTerm = req.query.term;
    try {
        const results = await searchInCacheOrDatabase2(searchTerm);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la căutare' });
    }
});


const imageDirectory2 = '../src/Styles/ImaginiCostume';

fs.readdir(imageDirectory2, async (err, files) => {
    if (err) {
        console.error('Eroare la citirea directorului:', err);
        return;
    }

    if (files.length === 0) {
        console.error('Nu s-au găsit fișiere în directorul specificat:', imageDirectory2);
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        for (const file of files) {
            const designerName = file.split('.')[0];
            const imagePath = `${imageDirectory2}/${file}`; 

            await compressAndInsertImage2(designerName, imagePath, conn);
        }
    } catch (error) {
        console.error('Eroare la conectarea sau interogarea bazei de date:', error);
    } finally {
        if (conn) conn.release();
    }
});

const compressAndInsertImage2 = async (designerName, imagePath, conn) => {
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

            const queryDesignerId = 'SELECT id FROM designeri WHERE nume = ?';
            const designerIdResults = await conn.query(queryDesignerId, [designerName]);

            if (designerIdResults.length === 0) {
                console.error(`Designerul cu numele '${designerName}' nu a fost găsit în baza de date.`);
                return;
            }

            const designerId = designerIdResults[0].id;

            const queryInsertImage = 'UPDATE designeri SET imagine = ? WHERE id = ?';
            await conn.query(queryInsertImage, [compressedImageBuffer, designerId]);

        });
    } catch (error) {
        console.error('Eroare la comprimarea și inserarea imaginii:', error);
    }
};


router.get('/getImageDesigner/:designerName', async (req, res) => {
    const designerName = req.params.designerName;

    let conn;
    try {
        conn = await pool.getConnection();
        const queryImage = 'SELECT imagine FROM designeri WHERE nume = ?';
        const result = await conn.query(queryImage, [designerName]);

        if (result.length === 0 || !result[0].imagine) {
            return res.status(404).json({ error: 'Imaginea nu a fost găsită pentru acest designer.' });
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