const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js")
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const { populate } = require("../models/review.js");


// index route
router.get("/",wrapAsync( async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")


})

//show route
router.get("/:id",wrapAsync (async (req,res)=>{
    let {id} =req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("Error","Listing you requested for does not exist  ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Create route
router.post("/",validateListing,wrapAsync( async(req,res,next)=>{
    //let {title,description,image,price,country,location}=req.body;
    
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing Created ");
    res.redirect("/listings");

}))



//Edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync( async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing updated! ");
    res.redirect(`/listings/${id}`)
}));

//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted! ");
    res.redirect("/listings");
}));

module.exports=router;

