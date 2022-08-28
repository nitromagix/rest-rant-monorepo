const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");

const router = express.Router();

const { User } = db;

router.get("/profile", async (req, res) => {
  // console.log(req.session.userId);
  try {
    const user = await User.findOne({
      where: { userId: req.session.userId },
    });
    res.json(user);
  } catch {
    res.json(null);
  }
});

router.post("/super-important-route", async (req, res) => {
  if (req.session.userId) {
    console.log("Do the really super important thing");
    res.send("Done");
  } else {
    console.log("You are not authorized to do the super important thing");
    res.send("Denied");
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: { email: body.email },
  });

  if (user && (await bcrypt.compare(body.password, user.passwordDigest))) {
    req.session.userId = user.userId;
    res.json({ user });
  } else {
    res.status(404).json({
      message: "Could not find a user with the provided username and password",
    });
  }
});

module.exports = router;
