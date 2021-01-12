const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const bizUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  companyName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  phoneNumber: {
    type: String,
    required: false,
    minlength: 9,
    maxlength: 10,
  },
  companyLogo: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  biz: {
    type: Boolean,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  ads: Array,
});

bizUserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      biz: this.biz,
      name: this.name,
      companyName: this.companyName,
      phoneNumber: this.phoneNumber,
      companyLogo: this.companyLogo,
    },
    config.get("jwtKey")
  );
  return token;
};

const BizUser = mongoose.model("BizUser", bizUserSchema);

function validateBizUser(bizUser) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    companyName: Joi.string().min(2).max(255).required(),
    phoneNumber: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    companyLogo: Joi.string().min(11).max(1024),
    biz: Joi.boolean().required(),
  });

  return schema.validate(bizUser);
}

function validateAds(data) {
  const schema = Joi.object({
    ads: Joi.array().min(1).required(),
  });

  return schema.validate(data);
}

exports.BizUser = BizUser;
exports.validate = validateBizUser;
exports.validateAds = validateAds;
