const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
   name:{required:true,unique:true,type:String}
},{ timestamps: true });


module.exports=mongoose.model('Category',categorySchema)