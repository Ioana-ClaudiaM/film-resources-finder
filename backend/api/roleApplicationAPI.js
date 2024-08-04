const express = require('express');
const router = express.Router();
const { pool } = require('./database');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'FilmResourcesFinder@gmail.com',
        pass: 'wvny arkb nldf gwbc'
    }
});

async function getProducerEmailById(producerId) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('SELECT email FROM utilizatori WHERE id_utilizator = ?', [producerId]);
        if (result.length > 0) {
            return result[0].email;
        } else {
            throw new Error('Producatorul cu acest ID nu exista.');
        }
    } catch (error) {
        console.error('Eroare la obtinerea adresei de email a producatorului:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

router.post('/send-aplicare', upload.fields([{ name: 'cvFile', maxCount: 1 }, { name: 'pdfBlob', maxCount: 1 }]), async (req, res) => {
    const producerId = req.body.producerId;
    if (!req.files || !req.files['cvFile'] || !req.files['pdfBlob']) {
        return res.status(400).send('CV-ul și PDF-ul sunt obligatorii.');
    }

    try {
        const producerEmail = await getProducerEmailById(producerId); 

        const attachments = [
            { filename: 'CV.pdf', content: req.files['cvFile'][0].buffer },
            { filename: 'Application.pdf', content: req.files['pdfBlob'][0].buffer }
        ];

        const mailOptions = {
            from: 'FilmResourcesFinder',
            to: producerEmail,
            subject: 'Application for Role',
            text: 'Please find attached the application for the role.',
            attachments: attachments
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (error) {
        console.error('Error processing application:', error.message);
        res.status(500).send(`Error processing application: ${error.message}`);
    }
});


router.post('/submit-application', async (req, res) => {
    let conn;
    try {
        const { id_utilizator, rol, nume, status, producerId } = req.body;

    
        conn = await pool.getConnection();

       const id_film_result = await conn.query('SELECT id_film FROM Roluri WHERE titlu=?', [rol]);
        const id_film = id_film_result[0].id_film;
        const titlu_film_result = await conn.query('SELECT titlu FROM Film WHERE id_film=?', [id_film]);
        if (!titlu_film_result.length) {
            throw new Error('Film title not found for the given film ID.');
        }
        const titlu_film = titlu_film_result[0].titlu;

        const nume_producator_result = await conn.query('SELECT nume FROM Utilizatori WHERE id_utilizator=?', [producerId]);
        const email_producator_result = await conn.query('SELECT email FROM Utilizatori WHERE id_utilizator=?', [producerId]);

        if (!nume_producator_result.length || !email_producator_result.length) {
            throw new Error('Producer details not found for the given producer ID.');
        }

        const nume_producator = nume_producator_result[0].nume;

        await conn.query(`
            INSERT INTO aplicari (id_utilizator, id_film, nume_utilizator, titlu_film, rol, nume_producator, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id_utilizator, id_film, nume, titlu_film, rol, nume_producator, status]);


    } catch (error) {
        console.error('Eroare la procesarea cererii de aplicare:', error.message);
        res.status(500).send(`A apărut o eroare în timpul procesării cererii de aplicare: ${error.message}`);
    } finally {
        if (conn) conn.release();
    }
});

router.put('/update-aplicare-status/:id_aplicare', async (req, res) => {
    const { id_aplicare } = req.params;
    const { status } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();
        const sql = `UPDATE aplicari SET status = ?, data_rezolutie = NOW() WHERE id_aplicare = ?`;
        await conn.query(sql, [status, id_aplicare]);
        console.log('Statusul aplicării actualizat cu succes!');
        res.status(200).send('Statusul aplicării actualizat cu succes');
    } catch (err) {
        console.error('Eroare la actualizarea statusului:', err);
        res.status(500).send('Eroare la actualizarea statusului');
    } finally {
        if (conn) conn.release();
    }
});


router.get('/get-aplicari/:id', async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const aplicari = await conn.query('SELECT * FROM aplicari WHERE id_utilizator = ?', [id]);
        res.json(aplicari);
    } catch (error) {
        console.error('Eroare la preluarea aplicărilor:', error);
        res.status(500).send('A apărut o eroare în timpul preluării aplicărilor.');
    } finally {
        if (conn) conn.release();
    }
});

router.get('/get-aplicari-actor/:nume', async (req, res) => {
    let conn;
    try {
        const { nume } = req.params;
        conn = await pool.getConnection();
        const aplicari = await conn.query(`
            SELECT a.*, f.id_film AS film_id, r.id_rol AS role_id
            FROM aplicari a
            JOIN Film f ON a.id_film = f.id_film
            JOIN Roluri r ON a.rol = r.titlu
            WHERE a.nume_producator = ?
        `, [nume]);
        res.json(aplicari);
    } catch (error) {
        console.error('Eroare la preluarea aplicărilor:', error);
        res.status(500).send('A apărut o eroare în timpul preluării aplicărilor.');
    } finally {
        if (conn) conn.release();
    }
});

router.post('/save-event', async (req, res) => {
    const { aplicareId, location, date, time, notes, actorId, producerId } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query('INSERT INTO Events (aplicare_id, location, date, time, notes, actor_id, producer_id) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [aplicareId, location, date, time, notes, actorId, producerId]);
        conn.release();
        res.status(200).json({ message: 'Eveniment salvat cu succes.' });
    } catch (error) {
        console.error('Eroare la salvarea evenimentului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.post('/events/create', async (req, res) => {
    const { aplicare_id, location, date, time, notes, actor_id, producer_id, type, id_film, id_rol } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(`
            INSERT INTO Events (aplicare_id, location, date, time, notes, actor_id, producer_id, type, id_film, id_rol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [aplicare_id, location, date, time, notes, actor_id, producer_id, type, id_film, id_rol]);

        const [actorDetails] = await conn.query('SELECT email, nume, telefon FROM Utilizatori WHERE id_utilizator = ?', [actor_id]);
        if (actorDetails.length > 0) {
            const actorEmail = actorDetails[0].email;
            const actorName = actorDetails[0].nume;
            const actorPhone = actorDetails[0].telefon;

            const mailOptions = {
                from: 'FilmResourcesFinder',
                to: actorEmail,
                subject: 'Detalii programare interviu',
                text: `Bună ${actorName},\n\nAi fost programat pentru un interviu.\n\n
                Detalii:\nLocație: ${location}\nData: ${date}\nOra: ${time}\n\nNote: ${notes}\n\nMult succes!\nFilmResourcesFinder`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }
        conn.release();
        res.status(201).json({ message: 'Eveniment creat cu succes!' });
    } catch (error) {
        console.error('Eroare la crearea evenimentului:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});


router.get('/get-events/:role', async (req, res) => {
    const { role } = req.params;
    try {
        const conn = await pool.getConnection();
        let query = 'SELECT * FROM Events';
        if (role === 'actor') {
            query += ' WHERE actor_id = ?';
        } else if (role === 'producer') {
            query += ' WHERE producer_id = ?';
        }
        const events = await conn.query(query, [role === 'actor' ? req.query.actor_id : req.query.producer_id]);
        conn.release();
        res.json(events);
    } catch (error) {
        console.error('Eroare la obținerea evenimentelor:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.get('/events', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const events = await conn.query(`
            SELECT e.*, u.nume AS actor_name, u.email AS actor_email, u.telefon AS actor_phone, 
                   a.titlu_film AS film_title, a.rol AS role_title
            FROM Events e
            JOIN Utilizatori u ON e.actor_id = u.id_utilizator
            JOIN aplicari a ON e.aplicare_id = a.id_aplicare
        `);
        conn.release();
        res.json(events);
    } catch (error) {
        console.error('Eroare la obținerea evenimentelor:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});

router.get('/events/actor/:actorId', async (req, res) => {
    const { actorId } = req.params;
    try {
        const conn = await pool.getConnection();
        const query = `
            SELECT e.*, u.nume AS actor_name, u.email AS actor_email, u.telefon AS actor_phone, 
                   f.titlu AS film_title, r.titlu AS role_title
            FROM Events e
            JOIN Utilizatori u ON e.actor_id = u.id_utilizator
            LEFT JOIN Film f ON e.id_film = f.id_film
            LEFT JOIN Roluri r ON e.id_rol = r.id_rol
            WHERE e.actor_id = ?
        `;
        const events = await conn.query(query, [actorId]);
        conn.release();

        if (events.length === 0) {
            console.log(`No events found for actor_id: ${actorId}`);
        } else {
            console.log(`Events found:`, events);
        }
        
        res.json(events);
    } catch (error) {
        console.error('Eroare la obținerea evenimentelor:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
});





module.exports = router;
