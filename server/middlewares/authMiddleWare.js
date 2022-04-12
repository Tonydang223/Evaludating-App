const jwt = require("jsonwebtoken");
const { ROLE_BASE } = require("../config/constant");
const User = require("../models/user.model");
async function authVerify(req,res,next){
    try {
        const token = req.header("Authorization")
        console.log(req.header)
        // Bearer + token send from client
         console.log(token)
        if(!token) return res.status(401).send({message:"Unauthorized"})
     
        jwt.verify(token,process.env.TOKEN_SECRET,async function(error,data){
            console.log(error,data);
            if(error) return res.status(403).json({message:"Token is not right or expired. You should reset mail forgot password again"})
            req.user = data
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Server error",error})
    }
}
async function verifyEmailMiddleWare(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send({ message: "Can not find account!!!" });
    } else {
      if (user.status === "inactive")
        return res
          .status(400)
          .send({ message: "You need you verify your email account!!!" });
      next();
    }
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
}
const isRole = {
  admin:async(req, res, next) => {
    try {
      const user = await User.findOne({_id:req.user.id})
      if(user.role !== 'admin') return res.status(400).send({message:`Admin resource . Access denied!!!`})
      next()
    } catch (err) {
        res.status(500).send({message:"Server error"})
    }
  },
  header:async(req, res, next) => {
    try {
      const user = await User.findOne({_id:req.user.id})
      if(user.role !== 'header') return res.status(400).send({message:`Header resource . Access denied!!!`})
      next()
    } catch (err) {
        res.status(500).send({message:"Server error"})
    }
  },
  employer:async(req, res, next) => {
    try {
      const user = await User.findOne({_id:req.user.id})
      if(user.role !== 'employer') return res.status(400).send({message:`Employer resource . Access denied!!!`})
      next()
    } catch (err) {
        res.status(500).send({message:"Server error"})
    }
  },
  manager:async(req, res, next) => {
    try {
      const user = await User.findOne({_id:req.user.id})
      if(user.role !== 'manager') return res.status(400).send({message:`Manager resource . Access denied!!!`})
      next()
    } catch (err) {
        res.status(500).send({message:"Server error"})
    }
  },
}

module.exports = { authVerify,verifyEmailMiddleWare,isRole };
