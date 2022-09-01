const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");

const { User } = db;

router.post("/", async (req, res) => {
  const { password, ...otherProperties } = req.body;

  const user = await User.create({
    ...otherProperties,
    role: 'reviewer',
    passwordDigest: await bcrypt.hash(password, 12),
  });
  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
