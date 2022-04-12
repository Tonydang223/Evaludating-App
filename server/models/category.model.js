const { boolean } = require('joi');
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Category = new Schema({
    content:{
        type:String,
        trim:true,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    },
    startDate:{
       type:Date,
       required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    post:[{
        type:Schema.Types.ObjectId,
        ref:'post'
    }]
});

const CategorySchema = mongoose.model('categories',Category);

module.exports = CategorySchema;
  