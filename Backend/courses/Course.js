const mongoose=require('mongoose')

const CourseSchema=new mongoose.Schema({
    title: { required: true, unique: true, type: String },
    coverImage:{
        path: String,
        contentType: String
    },
    description :String,
    formateur:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: true
    },
    categorie:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    status:{type:Boolean,default:true},
    prix:Number,
    description_detaillee:String,
    niveau:String,
    duree:String,
    langue:String,
    certificat:Boolean,
},{ timestamps: true });


module.exports=mongoose.model('Course',CourseSchema)