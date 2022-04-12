const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailActive");
const {
  registerSchema,
  loginSchema,
} = require("../helper/validate");


const authController = {
  signUp: async function (req, res, next) {
    try {
      const { name, email, address, password, phoneNumber, city,role } =
        req.body;
      const validatedFields = { email, password, name };
      console.log(validatedFields);
      const { error } = registerSchema(validatedFields);
      if (error)
        return res.status(400).json({ ...error?.details[0], status: 400 });

      const checkExist = await User.findOne({ email });
      if (checkExist) {
        return res
          .status(409)
          .json({ message: "Email is existed!!!", status: 409 });
      }
      const user = new User({
        name,
        email,
        address: address ? address : "",
        phoneNumber: phoneNumber ? phoneNumber : "",
        city: city ? city : "",
        password,
        role,
        status:'inactive'
      });
      const userSaved = await user.save();
      const emailActiveToken = createActiveMailToken({ id: userSaved._id });
      const url = `${process.env.URL_CLIENT}/auth/verify-email/${emailActiveToken}`;
      console.log(req.headers.host);
      sendEmail.emailActive(email, url, "Verify your email here");
      res.json({
        user: userSaved,
        status: 200,
        success: {
          message:
            "Register successfully and You need check your email to verify for the new account!!!",
        },
      });
    } catch (error) {
      res.status(500).send({ message: error });
    }
  },
  verifyEmail: async function (req, res, next) {
    try {
      const { token } = req.body;
      jwt.verify(
        token,
        process.env.ACTIVE_EMAIL_TOKEN,
        async function (err, data) {
          if (err) {
            return res
              .status(401)
              .json({ message: "token expired or token is not right" });
          }
          console.log(data.id);
          const checkisVerified = await User.findOne({ _id: data.id });
          if (checkisVerified._doc.status === "active") {
            return res.status(200).json({
              message:
                "Your account verified successfully before!! Please login",
            });
          }
          await User.findByIdAndUpdate(
            { _id: data.id },
            { $set: { status: 'active' } },
            { new: true }
          );
          res
            .status(200)
            .json({ message: "Your account verified successfully!!" });
        }
      );
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  resetLink: async function (req, res, next) {
    try {
      const { email } = req.body;

      const checkMail = await User.findOne({ email });
      if (!checkMail) {
        return res
          .status(400)
          .json({ message: "Your email account not existed!!!" });
      }
      if (checkMail._doc.status === "active") {
        return res
          .status(200)
          .json({
            message: "Your account have been verified. Please log in!!!",
          });
      }

      const token = createActiveMailToken({ id: checkMail._doc._id });
      const url = `${process.env.URL_CLIENT}/auth/verify-email/${token}`;
      sendEmail.emailActive(email, url, "Verify your email here");
      res.status(200).json({ message: "Re send link successfully!!!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: async function (req, res, next) {
    try {
      return res.status(200).clearCookie("refreshToken", { path: "/" }).json({ message: "Log out successfully!!!" });
    } catch (error) {
      return res.status(500).send({ message: "Log out fail!!!" });
    }
  },
  login: async function (req, res, next) {
    try {
      const userLogin = req.body;
      const { error } = loginSchema(userLogin);
      if (error)
        return res.status(400).json({ ...error?.details[0], status: 400 });

      const user = await User.findOne({ email: userLogin.email });
      const { password,status, ...userObj } = user._doc;
      const isValidatePassword = await bcrypt.compare(
        userLogin.password,
        user.password
      );
      if (!isValidatePassword) {
        return res.status(400).json({ message: "Invalid Password!!!" });
      }
      if(status === "suspend"){
        return res.status(403).json({message: "Your account is suspended!. You need to contact with the admin to access"})
      }
      const accessToken = createAccessToken({ id: user._doc._id });
      const refreshToken = createRefreshToken({ id: user._doc._id });
      res.status(200).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
      }).json({
        message: "Sign In successfully!!!",
        user: userObj,
        accessToken,
        refreshToken,
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  generatorAccessToken: async function (req, res, next) {
    const token = req.cookies.refreshToken;
    // const token = req.body.refreshToken;
    console.log(token);
    if (!token)
      return res.status(401).json({ message: "Please log in to access" });
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async function (error, data) {
        if (error) return res.status(403).json({ message: error });
        const user = await User.findOne({ _id: data.id }).select("-password");
        console.log(user);
        const accessToken = createAccessToken({ id: data.id });
        res.status(200).json({
          message: "Get token successfully!!!",
          accessToken,
          status: 200,
        });
        next();
      }
    );
  },
  forgotPass: async function (req, res, next) {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Yourr email is not existed!!!" });
    const accessToken = createAccessToken({ id: user._doc._id });
    const url = `${process.env.URL_CLIENT}/auth/resetPass/${accessToken}`;
    sendEmail.emailActive(email, url, "Reset Your Password");
    return res.status(200).json({ message: "ok" });
  },
  resetPassword: async function (req, res, next) {
    try {
      const { password,token } = req.body;
      console.log(token)
      if(!token){
        return res.status(400).json({
          message:
            "Invalid Auth!",
        });
      }
      
      const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
      if(!decoded) return res.status(400).json({message:'Can not verify the user!'})
      console.log(password.length);
      if (!password || password.length < 6 || password.length > 15)
        return res.status(400).json({
          message:
            "Please fill in a new password or password less than 15 characters and more than 6 characters!",
        });
      const salt = await bcrypt.genSalt(10);
      const hashPasswordReset = await bcrypt.hash(password, salt);
      console.log(req.user);
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { password: hashPasswordReset } },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "You updated your password successfully!" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "3d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "90d",
  });
};
const createActiveMailToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVE_EMAIL_TOKEN, {
    expiresIn: "1h",
  });
};

module.exports = authController;
