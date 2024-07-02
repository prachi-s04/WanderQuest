const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
//const path=require("path")

const MONGO_URL = "mongodb://localhost:27017/wanderquest";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("hi, i am root");
});

app.get("/testListing",async (req,res)=>{
    let sampleListing=new Listing({
        title:"My home",
        description:"by the beach",
        prize:1200,
        location:"mhowgaon",
        country:"india"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});