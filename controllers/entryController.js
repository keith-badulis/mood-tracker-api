const Entry = require("../models/entry");
const User = require("../models/user");

exports.entriesGET = async function (req, res, next) {
  console.log(req.params.username);

  const dateFrom = new Date(req.query.dateFrom);
  const dateTo = new Date(req.query.dateTo);

  try {
    const entries = await User.aggregate([
      { $project: { entries: 1, _id: 0 } },
      {
        $lookup: {
          from: "entries",
          localField: "entries",
          foreignField: "_id",
          as: "entryId",
        },
      },
      { $unwind: "$entryId" },
      {
        $project: {
          emoji: "$entryId.emoji",
          log: "$entryId.log",
          date: "$entryId.date",
        },
      },
      {
        $match: {
          date: { $gte: dateFrom, $lte: dateTo },
        },
      },
    ]);

    res.send(entries);
  } catch (error) {
    console.log(error);
  }
};

exports.entryPOST = async function (req, res, next) {
  try {
    const newEntry = new Entry({
      emoji: req.body.emoji,
      date: new Date(req.body.date),
      log: req.body.log,
    });

    const entry = await newEntry.save();
    await User.updateOne(
      { username: req.params.username },
      { $push: { entries: entry._id } }
    );

    res.status(201).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

exports.entryGET = async function (req, res, next) {
  console.log(req.params);

  try {
    const entry = await Entry.findById(req.params.entryId);
    res.send(entry);
  } catch (error) {
    console.log(error);
  }
};

exports.entryPUT = async function (req, res, next) {
  try {
    const updatedEntry = await Entry.findByIdAndUpdate(req.params.entryId, {
      emoji: req.body.emoji,
      date: req.body.date,
      log: req.body.log,
    });
    res.send(updatedEntry);
  } catch (error) {
    console.log(error);
  }
};

exports.entryDELETE = async function (req, res, next) {
  try {
    const deletedEntry = await Entry.findByIdAndDelete(req.params.entryId);
    await User.updateOne(
      { username: req.params.username },
      { $pull: { entries: deletedEntry._id } }
    );
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};
