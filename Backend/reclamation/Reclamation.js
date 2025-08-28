const mongoose=require('mongoose')

const reclamationSchema=new mongoose.Schema({
    sujet:{required:true,unique:false,type:String},
    type:String,
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cours:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false
    },
    hackathon:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hackathon",
        required: false
    },
    description:String,

},{ timestamps: true });


module.exports=mongoose.model('Reclamation',reclamationSchema)