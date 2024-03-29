const User = require("../models/user");
const Entry = require("../models/entry");

const jwt = require('jsonwebtoken');

exports.userLogin = async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });

    // username does not exist
    if (!user) res.status(401).end();

    // verify password
    const valid = user.validatePassword(req.body.password);
    if (valid) {
      const token = jwt.sign({
        data: user.username
      }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

      // u can store tokens sa cookies
      res.send({
        username: user.username,
        nickname: user.nickname,
        token: token,
      });
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userLogout = async function (req, res) {
  req.logout();
  res.send(401).end();
};

exports.userPOST = async function (req, res) {
  try {
    const newUser = new User({
      username: req.body.username,
      nickname: req.body.nickname,
      entries: [],
    });
    newUser.setPassword(req.body.password);
    await newUser.save();

    const token = jwt.sign({
      data: newUser.username
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

    res.send({
      username: newUser.username,
      nickname: newUser.nickname,
      token: token,
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userGET = async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userPUT = async function (req, res) {
  try {
    await User.findOneAndUpdate(
      { username: req.params.username },
      { ...req.body }
    );
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userDELETE = async function (req, res) {
  try {
    // delete user
    const deletedUser = await User.findOneAndDelete({
      username: req.params.username,
    });
    // delete entries of user
    await Entry.deleteMany({ _id: { $in: deletedUser.entries } });

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};
