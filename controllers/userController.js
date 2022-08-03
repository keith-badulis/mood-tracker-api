const User = require("../models/user");
const Entry = require("../models/entry");

exports.userPOST = async function (req, res) {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password, // zero security
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      height: req.body.height,
      weight: req.body.weight,
      nickname: req.body.nickname,
      birthday: new Date(req.body.birthday),
      entries: [],
    });
    await newUser.save();

    res.status(201).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.userGET = async function (req, res, next) {
  const user = await User.findOne({ username: req.params.username });
  console.log(user);
  res.send(user);
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