const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");

const tokenList = {};
const random = { value: 0 };

const router = express.Router();

const { User } = db;

router.get("/profile", async (req, res) => {
  try {
    const [authenticationMethod, token] = req.headers.authorization.split(" ");

    switch (authenticationMethod) {
      case "Bearer":
        const decodedToken = jwt.decode(process.env.JWT_SECRET, token);

        const { id } = decodedToken.value;
        const user = await User.findOne({
          where: { userId: id },
        });
        res.json(user);
    }
  } catch {
    res.json(null);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: { email: body.email },
  });

  if (user && (await bcrypt.compare(body.password, user.passwordDigest))) {
    // const token = jwt.sign(
    //   {
    //     id: user.userId,
    //   },
    //   process.env.TOKEN_SECRET,
    //   { expiresIn: process.env.TOKEN_LIFE }
    // );

    // const refreshToken = jwt.sign(
    //   {
    //     id: user.userId,
    //   },
    //   process.env.REFRESH_TOKEN_SERCRET,
    //   { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    // );

    // tokenList[refreshToken] = token;

    // random.value = Math.random();

    const token = await jwt.encode(process.env.JWT_SECRET, { id: user.userId });

    res.status(200).json({
      user: user,
      token: token,
      // refreshToken: refreshToken,
      // random: random,
    });
  } else {
    res.status(404).json({
      message: "Could not find a user with the provided username and password",
    });
  }
});

router.get("/token", async (req, res) => {
  try {
    const [authenticationMethod, token] = req.headers.authorization.split(" ");

    switch (authenticationMethod) {
      case "Bearer":
        const decodedToken = jwt.decode(process.env.TOKEN_SECRET, token);

        const { id } = decodedToken.value;
        const user = await User.findOne({
          where: { userId: id },
        });
        console.log(random.value);
        res.status(200).json({ user: user, random: random });
    }
  } catch {
    res.json(null);
  }
});

module.exports = router;
