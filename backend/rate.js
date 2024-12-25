import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';


const app = express();
const port = 1500;
app.use('*',bodyParser.json());
app.use(cors());

const rate =rateLimit({
    windowMs: 10*60*1000,
    max:5,
    message:"too many request from tis ip address try after 5 minutes"
});
app.use(rate);

try {
mongoose.connect('mongodb://localhost:27017/test',{useNewUrlParser:true,useUnifiedTopology:true});
console.log("Database connected successfully");
} catch (error) {
    console.log("Error in connecting database");
}

app.get("/",(req,res)=>{
    res.send("In root");
});

app.post("/check",async(req,res)=>{
    try{
        const a = await mongoose.connection.db.collection('rate').insertOne({
            Name:"Ramji",
            Age:23,
        });
    }catch(err){
        console.log("error in inserting data");
    }
    res.send("data inserted");
});

app.listen(port,()=>{
    console.log(`server is running in port number ${port}`);
});