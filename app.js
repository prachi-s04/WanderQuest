const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js")


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

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi, i am root");
});

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//index route
app.get("/listings", wrapAsync(async(req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching listings.");
    }
}));

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
})

//show route-read
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));
//app.get("/testListing",async (req,res)=>{
//    let sampleListing=new Listing({
//        title:"My home",
//        description:"by the beach",
//        prize:1200,
//        location:"mhowgaon",
//        country:"india"
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
//});

//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    //let{title,description,image,price,country,location}=req.body;
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//updtae route
app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let{ id }=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"))
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});