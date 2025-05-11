const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();

// Einfache "Datenbank" (im echten Leben würde man eine echte DB verwenden)
let entries = [];
const users = [
    {
        username: "familie",
        // Passwort ist "geheim123" (wird gehasht gespeichert)
        passwordHash: "$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq5Y0FfyAIW6QjwOVzJQe7.8WJ3Q."
    }
];

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

// Einträge abrufen
app.get('/entries', (req, res) => {
    res.json(entries);
});

// Neuen Eintrag hinzufügen
app.post('/entries', (req, res) => {
    entries.push(req.body);
    res.sendStatus(201);
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});