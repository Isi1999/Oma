const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Session Management
const session = require('express-session');
app.use(session({
    secret: 'dein_geheimes_session_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Für HTTPS auf true setzen
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login-Daten
const users = [
    { username: "familie", password: "geheim123" }
];

// Login-Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

// Logout-Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Schutzmittelware für geschützte Routen
function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

// Geschützte Hauptseite
app.get('/home.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Einträge (Beispiel)
let entries = [];
app.get('/entries', (req, res) => {
    res.json(entries);
});

app.post('/entries', checkAuth, (req, res) => {
    entries.push({
        text: req.body.text,
        date: new Date()
    });
    res.sendStatus(201);
});

// Root-Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));