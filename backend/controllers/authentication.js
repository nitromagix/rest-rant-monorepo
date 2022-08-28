const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");

const router = express.Router();

const { User } = db;

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: { email: body.email },
  });

  if (user && (await bcrypt.compare(body.password, user.passwordDigest))) {
    res.json({ user });
  } else {
    res.status(404).json({
      message: "Could not find a user with the provided username and password",
    });
  }
});

module.exports = router;
