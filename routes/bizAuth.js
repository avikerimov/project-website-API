const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { BizUser } = require("../models/bizUser");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let bizUser = await BizUser.findOne({ email: req.body.email.toLowerCase() });
  if (!bizUser) return res.status(400).send("Invalid email or password.");

  const validBizUserPassword = await bcrypt.compare(
    req.body.password,
    bizUser.password
  );
  if (!validBizUserPassword) return res.status(400).send("Invalid email or password.");

  res.json({ token: bizUser.generateAuthToken() });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = router;
