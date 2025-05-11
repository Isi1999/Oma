const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Einfache "Datenbank" mit Klartext-Passwort (unsicher!)
const users = [
    {
        username: "familie",  // Benutzername
        password: "geheim123" // Passwort im Klartext
    }
];

let entries = []; // Für deine Einträge

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login Route (jetzt mit Klartext-Vergleich)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (user && user.password === password) {
        res.sendStatus(200); // Erfolg
    } else {
        res.sendStatus(401); // Fehler
    }
});

// Rest des Codes bleibt gleich wie zuvor...
app.get('/entries', (req, res) => {
    res.json(entries);
});

app.post('/entries', (req, res) => {
    entries.push(req.body);
    res.sendStatus(201);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));