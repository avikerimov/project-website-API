const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate, validateAds } = require("../models/user");
const { Ad } = require("../models/ad");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/ads", auth, async (req, res) => {
  if (!req.user) return res.status(401).send("Access Denied");
  const ads = await Ad.find({})
  res.send(ads);
});

router.get("/my-favorite-ads", auth, async (req, res) => {
  if (!req.user) return res.status(401).send("Access Denied");
  try{
    const user = await User.findById(req.user._id).populate('favorites');
    console.log("user.favorites:" + user.favorites);
    res.send(user.favorites);
  } catch (ex) {
    console.log(ex);
    res.status(404).send('Invalid AD id')
  }
});

router.patch("/favorite-ads/:adId", auth, async (req, res) => {
  try{
    let userId = req.user._id;
    let adId = req.params.adId;
    console.log("userId: " + userId);
    console.log("adId: " + adId);

    const user = await User.findOne({_id: userId});
    console.log("user: " + user);

    if (user.favorites.includes(adId)){
      await User.updateOne({ _id: userId }, { $pull: { favorites: adId } });
    } else {
      await User.updateOne({ _id: userId }, { $addToSet: { favorites: adId } });
    }

    res.send(adId)
  } catch (ex) {
    console.log(ex);
    res.status(404).send("Invalid AD id");
  }
});


router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password", "ads"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
