import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

const app = express();
const port = 1600;
app.use('*',bodyParser.json());
app.use(cors());


const logger = winston.createLogger({
    level:'info',
    format:winston.format.json(),
    transports:[
    
        new winston.transports.File({filename:'result.log'})

    ]
});
const rate =rateLimit({
    windowMs: 10*60*1000,
    max:2,
    message:"too many request from tis ip address try after 5 minutes"
});
app.use(rate);

try {
mongoose.connect('mongodb://localhost:27017/test',{useNewUrlParser:true,useUnifiedTopology:true});
console.log("Database connected successfully");
logger.info("Database connected succesfully",{data:{port:'mongodb://localhost:27017/test'}})
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
        logger.info("Data inserted succesfully",{data:{username:"Ramji",Age:23}});
    }catch(err){
        console.log("error in inserting data");
        logger.info("Error in inserting data fileds ",{data:{username:"Ramji",Age:23}});
    }
    res.send("data inserted");
});

app.listen(port,()=>{
    console.log(`server is running in port number ${port}`);
});