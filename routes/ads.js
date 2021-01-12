const express = require("express");
const _ = require("lodash");
const { Ad, validateAd, generateBizNumber } = require("../models/ad");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/my-ads", auth, async (req, res) => {
  if (!req.user.biz) return res.status(401).send("Access Denied");
  const ads = await Ad.find({ user_id: req.user._id });
  res.send(ads);
});

router.delete("/:id", auth, async (req, res) => {
  const ad = await Ad.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!ad)
    return res.status(404).send("The ad with the given ID was not found.");
  res.send(ad);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateAd(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ad = await Ad.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!ad)
    return res.status(404).send("The ad with the given ID was not found.");

  ad = await Ad.findOne({ _id: req.params.id, user_id: req.user._id });
  res.send(ad);
});

router.get("/:id", auth, async (req, res) => {
  const ad = await Ad.findOne({ _id: req.params.id, user_id: req.user._id });
  if (!ad)
    return res.status(404).send("The ad with the given ID was not found.");
  res.send(ad);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateAd(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ad = new Ad({
    companyName: req.body.companyName,
    productName: req.body.productName,
    productDescription: req.body.productDescription,
    productPrice: req.body.productPrice,
    storeAddress: req.body.storeAddress,
    storePhone: req.body.storePhone,
    companyLogo: req.body.companyLogo,
    productImg: req.body.productImg,
    bizNumber: await generateBizNumber(Ad),
    user_id: req.user._id,
  });

  post = await ad.save();
  res.send(post);
});

module.exports = router;
