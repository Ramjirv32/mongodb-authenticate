const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt  = require('jsonwebtoken');

const app = express();
const p = 1200;
const JWT_SECRET = 's3cur3_K3y!@#2024_very_long_and_random_string';

app.use(bodyParser.json());
app.use(cors({ origin:'http://localhost:3000'}));

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("database connected successfully"))
    .catch((err) => {
        console.error("Database connection error:", err);
    });

app.get("/", (req, res) => {
    res.send("success");
});

app.post('/reg', async (req, res) => {
    try {
        const u = req.body.username;
        const pass = req.body.password;

        if (!u) {
            return res.status(500).send("username is undefined");
        }
        if (!pass) {
            return res.status(500).send("password is undefined");
        }

        const exist = await mongoose.connection.db.collection('coc').findOne({ username: u });
        if (exist) {
            return res.status(409).send("user already exists");
        }

        const r = await bcrypt.hash(pass, 10);
        console.log(r);
        
        await mongoose.connection.db.collection('coc').insertOne({
            username: u,
            password: r,
        });

        res.send("data hashed and inserted");
    } catch (err) {
        console.error("error in inserting data");
        res.status(500).send("error");
    }
});



app.post('/log', async (req, res) => {
    try {
        const u = req.body.username;
        const pass = req.body.password;

        if (!u) {
            return res.status(400).send("Username is required");
        }
        if (!pass) {
            return res.status(400).send("Password is required");
        }

        const exist = await mongoose.connection.db.collection('coc').findOne({ username: u });
        if (exist) {
            const match = await bcrypt.compare(pass, exist.password);
            if (match) {
                const an = jwt.sign({ username: u }, JWT_SECRET, { expiresIn: '1h' });
                res.status(201).json({ message: "Bearer token created", token: an });
            } else {
                res.status(401).send("Invalid password");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(p, () => {
    console.log(`Server is running on port http://localhost:${p}`);
});
