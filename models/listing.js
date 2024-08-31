const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
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
        type: Schema.Types.Mixed,  // Mixed type to handle both strings and objects
        default: "https://unsplash.com/photos/a-view-of-the-grand-canyon-from-the-top-of-a-mountain--jOic-c0jK0",
        set: function(v) {
            if (typeof v === 'object' && v.url) {
                return v;  // Store the full object if it's an image schema object
            }
            return v || "https://unsplash.com/photos/a-view-of-the-grand-canyon-from-the-top-of-a-mountain--jOic-c0jK0";  // Default or provided URL
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
 });
    
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;