const mongoose=require('mongoose')

const commentSchema=new mongoose.Schema({
    description:{required:true,unique:false,type:String},
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapitre",
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],

    },{ timestamps: true });


module.exports=mongoose.model('Comment',commentSchema)