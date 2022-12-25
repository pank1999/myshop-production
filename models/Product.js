const mongoose=require('mongoose');

const productSchema=new mongoose.Schema(
    {
       title:{type:String,required:true},
       desc:{type:String,required:true},
       img:{type:String,required:true},
       categories:{type:Array,required:true},
       price:{type:Number,required:true},
       color:{type:Array},
       size:{type:Array},
       inStock:{type:Boolean,default:true}

    },{timestamps:true}
     
);

module.exports=mongoose.model("Product",productSchema);