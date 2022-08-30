const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");

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
    const jwToken = await jwt.encode(process.env.JWT_SECRET, {
      id: user.userId,
    });
    // console.log(jwtToken);
    res.json({ user: user, token: jwToken.value });
  } else {
    res.status(404).json({
      message: "Could not find a user with the provided username and password",
    });
  }
});

module.exports = router;
