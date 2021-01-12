const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const { bool } = require("@hapi/joi");

const adSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  productName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  productDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  productPrice: {
    type: Number,
    required: true,
    positive: true,
    greater: 1,
    precision: 10,
  },
  storeAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400,
  },
  storePhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  companyLogo: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  productImg: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BizUser",
  },
  isFavorite: false,
});

const Ad = mongoose.model("Ad", adSchema);

function validateAd(ad) {
  const schema = Joi.object({
    companyName: Joi.string().min(2).max(255).required(),
    productName: Joi.string().min(2).max(255).required(),
    productDescription: Joi.string().min(2).max(1024).required(),
    productPrice: Joi.number().positive().greater(1).precision(2).required(),
    storeAddress: Joi.string().min(2).max(400).required(),
    storePhone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    companyLogo: Joi.string().min(11).max(1024),
    productImg: Joi.string().min(11).max(1024),
    isFavorite:bool()
  });

  return schema.validate(ad);
}

async function generateBizNumber(Ad) {
  while (true) {
    let randomNumber = _.random(1000, 999999);
    let ad = await Ad.findOne({ bizNumber: randomNumber });
    if (!ad) return String(randomNumber);
  }
}

exports.Ad = Ad;
exports.validateAd = validateAd;
exports.generateBizNumber = generateBizNumber;
