const Joi = require("joi");

const configValidates = {
  name: Joi.string().min(6).max(100).required(),
  email: Joi.string()
    .min(6)
    .max(200)
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .min(6)
    .max(15)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
};
const registerSchema = (data) => {
  const registerJoiSchema = Joi.object({
    name: configValidates.name,
    email: configValidates.email,
    password: configValidates.password,
  });
  return registerJoiSchema.validate(data);
};
const loginSchema = (data) => {
  const loginJoiSchema = Joi.object({
    email: configValidates.email,
    password: configValidates.password,
  });
  return loginJoiSchema.validate(data);
};
const isEmpty = (data) => {
    if(data === undefined || data === "" || data === null){
        return true
    }
    return false
};

module.exports = { registerSchema, loginSchema, isEmpty, configValidates };
