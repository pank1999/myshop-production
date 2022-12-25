const router=require("express").Router();
const Order=require("../models/Order");
const { verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin } = require("./verifyToken");





//Create 
router.post("/",verifyToken,async(req,res)=>{
    const newOrder = new Order(req.body);

    try{

       const savedOrder=await newOrder.save();
       res.status(200).json(savedOrder);
    
   }catch(err){
       res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{

      try{
            const updatedOrder= await Order.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});
            res.status(200).json(updatedOrder);
      }
      catch(err){
          res.status(500).json(err);
      }

});

//Delete 

router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try
     {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart is  deleted successful');
     }
    catch(err)
    {
       res.status(500).json(err);
    }
 
 });

 // Get USER Orders
router.get("/find/:userId",verifyTokenAndAutherization,async(req,res)=>{
    try
     {
       const orders= await Order.find({userId:req.params.userId});
      // const {...other}=user._doc;
        res.status(200).json(orders);
     }
    catch(err)
    {
       res.status(500).json(err);
    }
  
  });

  //Get All

  router.get("/",verifyTokenAndAdmin,async(req,res)=>{
       try{
           const orders=await Order.find();
           res.status(200).json(orders);    

       }catch(err){
          res.status(500).json(err);
       }
  });

  
//Get MONTHLY INCOME stats
router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const productId=req.query.pid;
    console.log(productId);
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth() -1));
    //console.log(lastMonth);
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth() -1));
    //console.log(previousMonth);
    
    try{

        const income=await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth},
               ...(productId && {
                 products:{$elemMatch:{ProductId:productId}},
               }),

            }},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount",
                },
            },
            {    
        
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"},
                },
                
            },
           
            
        ]);
        console.log(income);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
    }
  
  });


module.exports=router