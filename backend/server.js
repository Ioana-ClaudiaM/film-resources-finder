const express = require('express');
const app = express();
const http = require('http'); // Importă modulul HTTP
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Server } = require("socket.io");
const server = http.createServer(app); // Creează serverul HTTP folosind Express
const corsOptions = {
    origin: 'http://localhost:3000', // permite doar cereri de la această origine
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // permite doar aceste metode HTTP
  };

  app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
const { pool } = require('./api/database'); // Importă conexiunea cu baza de date
const authAPIRouter = require('./api/authAPI'); // Importă fișierul cu rutele API de autentificare
const emailAPIRouter = require('./api/EmailAPI'); // Importă routerul pentru API-ul de e-mail
const searchLocationAPIRouter=require('./api/searchLocationAPI');
const searchDesignersAPIRouter=require('./api/searchDesignersAPI');
const searchMakeupArtistAPIRouter=require('./api/searchMakeupArtistsAPI');
const searchFilmingTeamAPIRouter=require('./api/searchFilmingTeamAPI');
const searchSoundTeamAPIRouter=require('./api/searchSoundTeamAPI');
const roleApplicationAPIRouter=require('./api/roleApplicationAPI');
const moviesAPIRouter=require('./api/moviesAPI');
const rolesAPIRouter=require('./api/rolesAPI');
const skillsAPIRouter=require('./api/skillsAPI');
const languagesAPIRouter=require('./api/languagesAPI');
const experiencesAPIRouter=require('./api/experiencesAPI');
const eductionAPIRouter=require('./api/educationAPI');
const userDetailsAPIRouter=require('./api/userDetailsAPI');
const descriptionAPIRouter=require('./api/descriptionAPI');
const applicationsStatisticsAPI=require('./api/applicationsStatistics');
const producersAPI=require('./api/producersAPI');

app.use('/auth', authAPIRouter);
app.use('/email', emailAPIRouter);
app.use('/locations',searchLocationAPIRouter);
app.use('/designers',searchDesignersAPIRouter);
app.use('/makeupartists',searchMakeupArtistAPIRouter);
app.use('/filmingteam',searchFilmingTeamAPIRouter);
app.use('/soundteam',searchSoundTeamAPIRouter);
app.use('/roleapplication',roleApplicationAPIRouter);
app.use('/movies',moviesAPIRouter);
app.use('/roles',rolesAPIRouter);
app.use('/skills',skillsAPIRouter);
app.use('/languages',languagesAPIRouter);
app.use('/experiences',experiencesAPIRouter);
app.use('/education',eductionAPIRouter);
app.use('/userdetails',userDetailsAPIRouter);
app.use('/description',descriptionAPIRouter);
app.use('/statistics',applicationsStatisticsAPI);
app.use('/producers',producersAPI);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const producerConnections = {}; 
const actorConnections = {}; 

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        for (const producerId in producerConnections) {
            if (producerConnections[producerId] === socket.id) {
                delete producerConnections[producerId];
                break;
            }
        }

        for (const actorId in actorConnections) {
            if (actorConnections[actorId] === socket.id) {
                delete actorConnections[actorId];
                break;
            }
        }
    });

    socket.on("authenticateProducer", (producerId) => {
        producerConnections[producerId] = socket.id;
        console.log(`Producător autentificat: ${producerId}`);
    });

    socket.on("authenticateActor", (actorId) => {
        actorConnections[actorId] = socket.id;
        console.log(`Actor autentificat: ${actorId}`);
    });

    socket.on('likeNotification', (data) => {
        io.emit('newLike', data);
    });

    socket.on('applicationNotification', (data) => {
        io.emit('newLike', data);
    });
});

function sendNotificationToProducer(producerId, message) {
    const producerSocketId = producerConnections[producerId];
    if (producerSocketId) {
        console.log(producerId);
        io.to(producerSocketId).emit('notification', message);
    } else {
        console.log(`Producătorul cu ID-ul ${producerId} nu este conectat.`);
    }
}

function sendNotificationToActor(actorId, message) {
    const actorSocketId = actorConnections[actorId];
    if (actorSocketId) {
        console.log(`Trimitere notificare către actorul cu ID: ${actorId}`);
        io.to(actorSocketId).emit('notification', message);
    } else {
        console.log(`Actorul cu ID-ul ${actorId} nu este conectat.`);
    }
}

app.post('/sendNotificationActor', (req, res) => {
    const { actorId, message } = req.body;
    sendNotificationToActor(actorId, message);
    res.sendStatus(200);
  });
  

app.post('/sendNotification', (req, res) => {
    const { producerId, message } = req.body;
    sendNotificationToProducer(producerId, message);
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send('Bun venit pe serverul film-resources-finder!');
});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});