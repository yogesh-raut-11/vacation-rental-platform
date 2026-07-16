const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{
    res.send("Hi, i am root");
})
// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title: "My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangut, Goa",
//         country:"India",
//     });
//     await sampleListing.save()
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

// index route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id} =req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//Create route
app.post("/listings",async(req,res)=>{
    //let {title,description,image,price,country,location}=req.body;
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")

})

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
})

//Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})
app.listen("3000",()=>{
    console.log("App is listen on the port 8080");
})