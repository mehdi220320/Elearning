const mongoose=require('mongoose')

const instructorSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    picture:{
        path: String,
        contentType: String
    },
    email:{required:true,unique:true,type:String},
    biographie :String,
    phone:Number,
    speciality:String,
    Competences:[String],
    LinkedIn:String,
    Twitter:String,
    GitHub:String,
    Site_web:String
},{ timestamps: true });


module.exports=mongoose.model('Instructor',instructorSchema)