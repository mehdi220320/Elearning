const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        unique:true,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);

module.exports = Token;
