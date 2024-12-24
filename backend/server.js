const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const p = 1200;

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

app.listen(p, () => {
    console.log(`Server is running on port http://localhost:${p}`);
});
