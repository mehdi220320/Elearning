const mongoose=require('mongoose')
const hackathonSchema=new mongoose.Schema({
   title:{required:true,unique:true,type:String},
   location:String,
   startDate:Date,
   endDate :Date,
   shortDescription:String,
   description:String,
   theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
   },
   courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
   }],
   status: {
      type: String,
      enum: ['in_progress', 'finished', 'scheduled'],
      default: 'scheduled'}
   ,
   fee:Number,
   Prizes:Number,
   coverImage:{
      path: String,
      contentType: String
   },
},{ timestamps: true });


module.exports=mongoose.model('Hackathon',hackathonSchema)