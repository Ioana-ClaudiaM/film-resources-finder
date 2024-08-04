const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, getUserByEmail } = require('./database');

router.post('/Login', async (req, res) => {
  const { email, parola } = req.body;

  if (!email || !parola) {
    return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Autentificare eșuată. Adresa de email sau parola incorectă.' });
    }

    const passwordMatch = await bcrypt.compare(parola, user.parola);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Autentificare eșuată. Adresa de email sau parola incorectă.' });
    }

    const { id_utilizator, tip_utilizator, nume } = user;
    const token = jwt.sign({ id: id_utilizator, tip_utilizator, nume }, "jwtSecret", { expiresIn: '1h' });

    await pool.query('REPLACE INTO tokenuri (id_utilizator, token, data_expirare) VALUES (?, ?, ?)', [id_utilizator, token, new Date(Date.now() + 3600000)]);

    res.json({ auth: true, token, user: { id: id_utilizator, tip_utilizator, nume } });

  } catch (error) {
    console.error('Eroare la autentificare:', error);
    res.status(500).json({ error: 'Eroare internă a serverului.' });
  }
});

router.post('/SignUp', async (req, res) => {
  const { nume, email, telefon, parola, localitate, judet, tip_utilizator } = req.body;
  const hashedPassword = await bcrypt.hash(parola, 10);

  const query = 'INSERT INTO utilizatori (nume, email, telefon, parola, localitate, judet, tip_utilizator) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  try {
    const conn = await pool.getConnection();
    await conn.query(query, [nume, email, telefon, hashedPassword, localitate, judet, tip_utilizator]);
    conn.release();
    res.status(200).send('Utilizator înregistrat cu succes!');
  } catch (error) {
    console.error('Eroare la înregistrare:', error);
    res.status(500).json({ error: 'Eroare internă a serverului.' });
  }
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'FilmResourcesFinder',
    pass: 'wvny arkb nldf gwbc'
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Adresa de email este obligatorie.' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    }

    const token = jwt.sign({ id: user.id_utilizator }, "jwtSecret", { expiresIn: '1h' });

    const mailOptions = {
      from: 'FilmResourcesFinder',
      to: email,
      subject: 'Resetare parolă',
      text: `Click pe acest link pentru a reseta parola: http://localhost:3000/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Link-ul pentru resetarea parolei a fost trimis pe email.' });
      }
    });
  } catch (error) {
    console.error('Eroare la trimiterea email-ului:', error);
    res.status(500).json({ message: 'Eroare internă a serverului.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { newPassword, token } = req.body;

  if (!newPassword || !token) {
    return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
  }

  try {
    const decoded = jwt.verify(token, "jwtSecret");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE utilizatori SET parola = ? WHERE id_utilizator = ?', [hashedPassword, decoded.id]);

    res.json({ message: 'Parola a fost resetată cu succes.' });
  } catch (error) {
    console.error('Eroare la resetarea parolei:', error);
    res.status(500).json({ message: 'Eroare internă a serverului.' });
  }
});

module.exports=router;