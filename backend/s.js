import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 1300;
app.use('*',bodyParser.json());
app.use(cors());
try {
  mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true, useUnifiedTopology: true })
  console.log("Data base is connected");

    
} catch (error) {
    console.log("error in connecting database");
}

app.get("/",(req,res)=>{
    res.send("In root");
})
app.post("/check",async(req,res)=>{
    try{
    const a = await mongoose.connection.db.collection('s').insertOne({
        Name :"Ramji",
        Age:23,
    });}
    catch(err){
        console.log("error in inserting data");
    }

    res.send("data inserted");
    

})
app.listen(port,()=>{
    console.log(`server is running in port number ${port}`);
})