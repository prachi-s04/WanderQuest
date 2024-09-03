const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")
const {isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


//get and post route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn ,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create));

//new route
router.get("/new", isLoggedIn ,listingController.new);

//show , update and delte route
router
.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner ,upload.single("listing[image]"),validateListing, wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner , wrapAsync(listingController.delete));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync(listingController.edit));

module.exports=router;

