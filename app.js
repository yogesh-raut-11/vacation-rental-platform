const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js")

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


app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)

app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
    // res.render("listings/error.ejs",{message});
});
app.listen("3000",()=>{
    console.log("App is listen on the port 8080");
});