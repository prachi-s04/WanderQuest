const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")
const {isOwner,validateListing}=require("../middleware.js");

//index route
router.get("/", wrapAsync(async(req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching listings.");
    }
}));

//new route
router.get("/new", isLoggedIn ,(req,res)=>{
    res.render("listings/new.ejs");
});

//show route-read
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id)
    .populate({path: "reviews",populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/", isLoggedIn ,validateListing,wrapAsync(async(req,res,next)=>{
        const newListing=new Listing({
            ...req.body.listing,
            image: req.body.listing.image 
        });
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//updtae route
router.put("/:id",isLoggedIn,isOwner ,validateListing, wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner , wrapAsync(async(req,res)=>{
    let{ id }=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports=router;

