const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostModel = new Schema({
    title:{
        type: String,
        maxlength:200,
        trim:true,
        require:true
    },
    category:{
        type:Schema.Types.ObjectId,ref:'categories', required:true
    },
    content:{
        type:String,
    },
    images:{
        type:Array
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    checkTerm:{
       type:Boolean,
       require:true
    },
    like:[{type:Schema.Types.ObjectId,ref:'users'}],
    comment:[{type:Schema.Types.ObjectId,ref:'comments'}]
},{
    timestamps:true
})

const PostScheme = mongoose.model('post', PostModel);
module.exports = PostScheme