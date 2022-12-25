const router=require("express").Router();
const User=require("../models/User");
const Crypto=require("crypto-js");
const jwt=require("jsonwebtoken");



//Register

router.post("/register",async (req,res)=>{
    console.log("/register");
    const newUser= new User({
        name:req.body.Name,
        userName:req.body.userName,
        email:req.body.email,
        password:Crypto.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
        // gender:req.body.gender,
        dob:req.body.DOB,
        isAdmin:req.body.isAdmin

    });    
    console.log(newUser);

    try{
        const savedUser= await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
    
});


//Login
router.post("/login",async(req,res)=>{
     try{
        console.log(req.body);
        const user=await User.findOne({userName:req.body.username});
        !user && res.status(401).json("wrong credential");
        const hashedPassword=Crypto.AES.decrypt(user.password,process.env.PASS_SEC);
        const password=hashedPassword.toString(Crypto.enc.Utf8);
        console.log(password);
        password!==req.body.password && res.status(401).json("wrong credentails");
        
        

        const accessToken=jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SEC,{expiresIn:"3d"});

        res.status(200).json({user,accessToken});
     }catch(err){
        res.status(500).json(err);
     }
});

module.exports=router