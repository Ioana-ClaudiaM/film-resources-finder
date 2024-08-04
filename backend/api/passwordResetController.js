const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { getUserByEmail,pool} = require('./database');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'FilmResourcesFinder',
        pass: 'wvny arkb nldf gwbc'
    }
});

async function updatePassword(userId, hashedPassword) {
    let conn = await pool.getConnection();

    const result = await conn.query('UPDATE utilizatori SET parola = ? WHERE id_utilizator = ?', [hashedPassword, userId]);
    return result;
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Adresa de email nu este asociată cu niciun cont.' });
        }
        const resetToken = jwt.sign({ id: user.id_utilizator }, 'resetSecret', { expiresIn: '1h' });
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: 'FilmResourcesFinder',
            to: email,
            subject: 'Resetare Parolă',
            text: `Pentru a reseta parola, accesează următorul link: ${resetLink}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Eroare trimitere email:', error);
                res.status(500).json({ error: 'Eroare la trimiterea emailului de resetare a parolei.' });
            } else {
                console.log('Email trimis:', info.response);
                res.status(200).json({ success: true, message: 'Un email pentru resetarea parolei a fost trimis cu succes.' });
            }
        });
    } catch (error) {
        console.error('Eroare la resetarea parolei:', error);
        res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decodedToken = jwt.verify(token, 'resetSecret');
        const userId = decodedToken.id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updatePassword(userId, hashedPassword);

        res.status(200).json({ success: true, message: 'Parola a fost resetată cu succes.' });
    } catch (error) {
        console.error('Eroare la resetarea parolei:', error);
        res.status(400).json({ error: 'Link-ul pentru resetarea parolei este invalid sau a expirat.' });
    }
};
