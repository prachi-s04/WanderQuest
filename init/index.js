const mongoose =require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL = "mongodb://localhost:27017/wanderquest";

main()
   .then(()=>{
        console.log("Connected to DB");
    }).catch(err=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'66d1da710414ee84f155bdc1'}));
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
};

initDB();