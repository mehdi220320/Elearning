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
      enum: ['ongoing', 'completed','canceled', 'scheduled'],
      default: 'scheduled'}
   ,
   fee:Number,
   Prizes:String,
   coverImage:{
      path: String,
      contentType: String
   },
   maxParticipants:Number,
   objectifs:[String],
   skills:[String],
   rules:[String],
   participants:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }],
},{ timestamps: true });


module.exports=mongoose.model('Hackathon',hackathonSchema)