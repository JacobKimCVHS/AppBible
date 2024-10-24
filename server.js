const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Users data file
const usersFilePath = 'users.txt';

// Read users from the file
const readUsersFromFile = () => {
    if (!fs.existsSync(usersFilePath)) return {};
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return data.split('\n').reduce((acc, line) => {
        const [username, password] = line.split(':');
        if (username) acc[username] = password;
        return acc;
    }, {});
};

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const users = readUsersFromFile();

    if (users[username]) {
        return res.status(400).json({ message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    fs.appendFileSync(usersFilePath, `${username}:${hashedPassword}\n`);
    res.status(201).json({ message: 'User created successfully!' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const users = readUsersFromFile();

    if (!users[username]) {
        return res.status(400).json({ message: 'Invalid username or password!' });
    }

    const match = await bcrypt.compare(password, users[username]);
    if (!match) {
        return res.status(400).json({ message: 'Invalid username or password!' });
    }

    res.status(200).json({ message: 'Login successful!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
