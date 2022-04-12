const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = new Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
         type:String,
         trim:true
    },
    password:{
        type:String,
    },
    address:{
        type:String,
    },
    city:{
        type:String
    },
    role:{
        type:String,
        default:'employer',
        enum:['employer','manager','admin','header']
    },
    status:{
        type:String,
        default:'inactive',
        enum:['active','inactive','suspend']
    },
    avatar:{
        type:String,
        default:'https://res.cloudinary.com/dipro/image/upload/v1645001565/avatar/default-avatar-profile-icon-vector-social-media-user-portrait-176256935_f2t2yd.jpg'
    },
    phoneNumber:{
        type:String,
    }
},{timestamps:true})


UserModel.pre('save',async function(next){
   try {
       const salt = await bcrypt.genSalt(10)
       const hashPassword = await bcrypt.hash(this.password,salt)
       this.password = hashPassword
    return next()
   } catch (err) {
       next(err)
   }
})

// UserModel.methods.isValidPassword = async function (password) {
//     try {
//         return await bcrypt.compare(password,this.password)
//     } catch (error) {
//         throw error
//     }
// }
const UserSchema = mongoose.model('users',UserModel)

module.exports = UserSchema