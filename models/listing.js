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
        /*set:(v) => 
            v === "" 
              ? "https://unsplash.com/photos/a-view-of-the-grand-canyon-from-the-top-of-a-mountain--jOic-c0jK0"
              :v,*/
              set: function(v) {
                if (typeof v === 'object' && v.url) {
                    return v.url;  // Extract URL if it's stored as an object
                }
                return v || "https://unsplash.com/photos/a-view-of-the-grand-canyon-from-the-top-of-a-mountain--jOic-c0jK0";  // Default or provided URL
            }
    },
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;