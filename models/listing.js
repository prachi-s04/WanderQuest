const mongoose =require("mongoose");
const Schema=mongoose.Schema;

//const imageSchema = new Schema({
//   filename: String,
//   url: String,
//});

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },    
    description:String,
    image:{
        type: String,
        default:"https://unsplash.com/photos/a-view-of-the-grand-canyon-from-the-top-of-a-mountain--jOic-c0jK0",
        set:(v) => 
            v === "" 
              ? "https://unsplash.com/photos/a-view-of-the-grand-canyon-from-the-top-of-a-mountain--jOic-c0jK0"
              :v,
    },
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;