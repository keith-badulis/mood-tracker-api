const User = require("../models/user");
const Entry = require("../models/entry");

exports.userLogin = async function (req, res) {

  try {
    
    const user = await User.findOne({username: req.body.username});
    const valid = user.validatePassword(req.body.password);

    console.log("Valid password?")
    console.log(valid);

    res.send("user login");

  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userPOST = async function (req, res) {
  try {
    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      height: req.body.height,
      weight: req.body.weight,
      nickname: req.body.nickname,
      birthday: new Date(req.body.birthday),
      entries: [],
    });
    newUser.setPassword(req.body.password);
    await newUser.save();

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
    const deletedUser = await User.findOneAndDelete({
      username: req.params.username,
    });

    console.log(deletedUser);

    await Entry.deleteMany({ _id: { $in: deletedUser.entries } });

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};
