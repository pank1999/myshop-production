const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const userRoute=require("./routes/user");
const authRoute=require("./routes/auth");
const productRoute=require("./routes/Product");
const cartRouter=require("./routes/Cart");
const orderRouter=require("./routes/Order");
const checkoutRouter=require("./routes/stripe");
const cors=require('cors');
const path=require("path");
dotenv.config();

mongoose.connect(process.env.MONGO_URL
).then(()=>console.log("DBconnection suceess")).catch((err)=>{
    console.log(err);
});

const app=express();

app.use(express.json());

app.use(express.static(path.join(__dirname,"../myshop/build")))

app.get("*",(req,res)=>{
   res.sendFile(path.join(__dirname,"myshop/build/index.html"));
})
app.use(cors());
app.get("/",(req,res)=>{
    res.send("hello world");
});

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/checkout",checkoutRouter);

app.listen(process.env.PORT || 5000,()=>{
   console.log("surver is running on port 3003");
});
