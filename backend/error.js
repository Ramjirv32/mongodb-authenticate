import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Boom from "@hapi/boom";

const app = express();
const port = 1400;

app.use(bodyParser.json());
app.use(cors());



const jwt_key = "s3cur3_K3y!@#2024_very_long_and_random_string";

app.get("/", (req, res) => {
    res.send("Hi in Home page");
});

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/check", async (req, res, next) => {
    try {
        const u = req.body.username;
        const pas = req.body.password;

        if (!u) {
            throw Boom.badRequest("username is required");
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
        
        next(error);
    }
});

app.use((err,req,res,next)=>{
    if(err.isBoom){
        return res.status(err.output.statusCode).json(err.output.payload);
    }else{
        res.sendStatus(500);
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
