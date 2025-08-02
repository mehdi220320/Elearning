const mongoose = require('mongoose');

const ChapitreSchema = new mongoose.Schema({
    title: { required: true, type: String },
    description: String,
    file: {
        path: String,
        contentType: String,
        size:Number,
        name:String
    },
    url: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    nombrePage: Number,
    dureeVideo: String
}, { timestamps: true });

ChapitreSchema.index({ title: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Chapitre', ChapitreSchema);
