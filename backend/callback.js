// callback.js
import express from "express";

const app= express();
const port = 4200;

let i = 0;
app.get("/",(req,res)=>{
    
    console.log("request is recieved");
    const r = i+1;
    i=r;

    setTimeout(()=>{
        res.send(`This is request${r} process`);
    },10000);
})

app.listen(port,()=>{
    console.log(`Port is running at${port}`);
})