const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Comment = new Schema({
    content:{
        type:String,
        require:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users',
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'post'
    }
});

const CommentSchema = mongoose.model('comments',Comment);

module.exports = CommentSchema;
  