const User = require("../models/user");
const Entry = require("../models/entry");

exports.userLogin = async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });

    // username does not exist
    if (!user) res.status(401).end();

    // verify password
    const valid = user.validatePassword(req.body.password);
    if (valid) {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      res.send({
        username: user.username,
        nickname: user.nickname,
      });
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userPOST = async function (req, res) {
  try {
    if (req.session.loggedIn && req.session.username === req.params.username) {
      const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        height: req.body.height,
        weight: req.body.weight,
        nickname: req.body.nickname,
        gender: req.body.gender,
        birthday: new Date(req.body.birthday),
        entries: [],
      });
      
      newUser.setPassword(req.body.password);
      
      await newUser.save();
      
      res.status(201).end();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userGET = async function (req, res, next) {
  try {
    if (req.session.loggedIn && req.session.username === req.params.username) {
      const user = await User.findOne({ username: req.params.username });
      res.send(user);
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userPUT = async function (req, res) {
  try {
    if (req.session.loggedIn && req.session.username === req.params.username) {
      await User.findOneAndUpdate(
        { username: req.params.username },
        { ...req.body }
      );
      res.status(200).end();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userDELETE = async function (req, res) {
  try {
    if (req.session.loggedIn && req.session.username === req.params.username) {
      // delete user
      const deletedUser = await User.findOneAndDelete({
        username: req.params.username,
      });
      // delete entries of user
      await Entry.deleteMany({ _id: { $in: deletedUser.entries } });
  
      res.status(200).end();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};
