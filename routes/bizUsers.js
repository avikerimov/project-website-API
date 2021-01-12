const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { BizUser, validate, validateAds } = require("../models/bizUser");
const { Ad } = require("../models/ad");
const auth = require("../middleware/auth");
const router = express.Router();

const getAds = async (adsArray) => {
  const ads = await Ad.find({ bizNumber: { $in: adsArray } });
  return ads;
};

router.get("/ads", auth, async (req, res) => {
  if (!req.query.numbers) res.status(400).send("Missing numbers data");

  let data = {};
  data.ads = req.query.numbers.split(",");

  const ads = await getAds(data.ads);
  res.send(ads);
});

router.patch("/ads", auth, async (req, res) => {
  const { error } = validateAds(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const ads = await getAds(req.body.ads);
  if (ads.length != req.body.ads.length)
    res.status(400).send("Ad numbers don't match");

  let user = await BizUser.findById(req.user._id);
  user.ads = req.body.ads;
  user = await user.save();
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await BizUser.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await BizUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send("BizUser already registered.");

  user = new BizUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    companyLogo: req.body.companyLogo,
    ads: req.body.ads,
    biz: req.body.biz,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", user.name, user.email]));
});

module.exports = router;
