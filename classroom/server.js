const express=require("express");
const app=express();
const users=require("./routes/user.js")
const posts=require("./routes/post")
const session=require("express-session")
const flash=require("connect-flash")
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//session
const sessionOptions=({
    secret:"mysuperseceretstring",
    resave:false,
    saveUninitialized:true,
})
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","User not registered")
    }else{
    req.flash("success","user register successfully")
    }
    res.redirect("/hello")
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name})    
})

//session req count
// app.use(session({secret:"mysupersecretstring",resave:false, saveUninitialized:true}));

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you send a request ${req.session.count} times`);
// });


// app.get("/test",(req,res)=>{
//     res.send("Test is successful")
// })



//Cookie

// const cookieParser=require("cookie-parser");
// const { applyTimestamps } = require("../models/review.js");
// app.use(cookieParser("seceretcode"));

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("Send you some cookies");
// })

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India", {signed:true});
//     res.send("Signd cookie sent")
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified");
// })

// app.get("/greet",(req,res)=>{
//     let{name="anonymous"}=req.cookies;
//     res.send(`Hi ${name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root ");
// });

// app.use("/users",users)
// app.use("/posts",posts)


app.listen(3000,()=>{
    console.log("Server listing on port 3000")
})