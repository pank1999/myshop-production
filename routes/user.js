const router=require("express").Router();
const User =require("../models/User");

const {verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin}=require("./verifyToken");



router.put("/:id",verifyTokenAndAutherization,async(req,res)=>{
      if(req.body.password){
        req.body.password= Crypto.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
      }
      try{
            const updatedUser= await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});
            res.status(200).json(updatedUser);
      }
      catch(err){
          res.status(500).json(err);
      }

});


//Delete 

router.delete("/:id",verifyTokenAndAutherization,async(req,res)=>{
   try
    {
       await User.findByIdAndDelete(req.params.id);
       res.status(200).json('user deleted successful');
    }
   catch(err)
   {
      res.status(500).json(err);
   }

});

// Get user 
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
  try
   {
     const user= await User.findById(req.params.id);
     const {password,...other}=user._doc;
      res.status(200).json(other);
   }
  catch(err)
  {
     res.status(500).json(err);
  }

});


// Get All user 
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
  try
   {
     console.log("api hittinh");
     const query=req.query.new;
     const users= query?await User.find().limit(10) : await User.find();
      res.status(200).json(users);
   }
  catch(err)
  {
     res.status(500).json(err);
  }

});


//Get user stats
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
  const date=new Date();
  const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
  try{
     const data= await User.aggregate([
      {
        $match:{createdAt:{$gte:lastYear}}
      },
      {
        $project:{month:{$month:"$createdAt"}}
      },
      {
        $group:{_id:"$month",total:{$sum:1}}
      }
     ]);
     res.status(200).json(data);
  }
  catch(err){
    res.status(500).json(err);
  }


  //create user can be implemented if needed

})


module.exports=router