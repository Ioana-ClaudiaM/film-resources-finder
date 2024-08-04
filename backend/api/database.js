const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'parola',
    database: 'film-resources-finder',
    connectionLimit: 50,
    acquireTimeout: 1000000,
    waitForConnections: true,
    queueLimit: 0,
});

async function getUserByEmail(email) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM utilizatori WHERE email = ?", [email]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

async function adaugaToken(id_utilizator, token, data_expirare) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO Tokenuri (id_utilizator, token, data_expirare) VALUES (?, ?, ?)", [id_utilizator, token, data_expirare]);
    } catch (error) {
        console.error('Eroare la adăugarea tokenului:', error);
    } finally {
        if (conn) conn.release();
    }
}

const getUserByToken = async (token) => {
    let conn;
    try {
        const decoded = jwt.verify(token, "jwtSecret");
        conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM utilizatori WHERE id_utilizator = ?", [decoded.id]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Error getting user by token:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { pool, getUserByEmail, adaugaToken,  getUserByToken };
