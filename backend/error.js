import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const port = 1400;

app.use(bodyParser.json());
app.use(cors());

const jwt_key = "s3cur3_K3y!@#2024_very_long_and_random_string";

app.get("/", (req, res) => {
    res.send("Hi in Home page");
});

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/check", async (req, res) => {
    try {
        const u = req.body.username;
        const pas = req.body.password;

        if (!u) {
            return res.status(401).send("undefined username");
        }
        if (!pas) {
            return res.status(401).send("undefined password");
        }

        const av = await mongoose.connection.db.collection('error').findOne({ username: u });
        
        if (av) {
            const bear = jwt.sign({ username: av.username }, jwt_key, { expiresIn: '1h' });
            return res.json({ message: "success", bearerToken: bear });
        }

        const hash = await bcrypt.hash(pas, 10);
        
        await mongoose.connection.db.collection('error').insertOne({
            username: u,
            password: hash,
        });

        console.log("Data hashed and inserted");
        res.send("User registered. Send a request for a bearer token.");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
