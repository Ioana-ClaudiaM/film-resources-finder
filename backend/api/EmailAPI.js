const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-email', async (req, res) => {
    try {
        const { recipient, subject, message } = req.body;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'FilmResourcesFinder',
                pass: 'wvny arkb nldf gwbc'
            }
        });

        const mailOptions = {
            from: 'FilmResourcesFinder', 
            to: recipient,
            subject: subject, 
            text: message
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
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    }
});

module.exports = router;
