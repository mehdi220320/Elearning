const mongoose=require('mongoose')

const RatingSchema=new mongoose.Schema({
    rate:Number,
    comment :String,
    formateur:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor"
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{ timestamps: true });


module.exports=mongoose.model('Rating',RatingSchema)