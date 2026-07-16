const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required : true,
    },
    description:String,
    image:{
        filename:{
             type:String,
              default:"listingimage",
        },
        url:{
            type : String,
            default:"https://images.pixels.com/photos/37144687/pixels-photo-37144687.jpeg"
        },
    },
    price:Number,
    location:String,
    country:String,
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;