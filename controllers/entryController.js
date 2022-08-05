const Entry = require("../models/entry");
const User = require("../models/user");

exports.entriesGET = async function (req, res, next) {
  const dateFrom = new Date(req.query.dateFrom);
  const dateTo = new Date(req.query.dateTo);

  try {
    const entries = await User.aggregate([
      { $match: { username: req.params.username } },
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

    console.log(entries);

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

exports.entriesCalendarMarksGET = async function (req, res) {
  console.log(req.query.monthDate);

  const date = new Date(req.query.monthDate);
  const month = date.getMonth();
  const year = date.getFullYear();
  console.log(month + " " + year);

  try {
    const datesWithEntries = await User.aggregate([
      { $match: { username: req.params.username } },
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
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
      },
      { $match: { month: month + 1, year: year } },
      { $group: { _id: { date: "$date" } } },
      {
        $project: {
          date: "$_id.date",
          _id: 0,
        },
      },
      // {$addFields: {
      //   array: [{
      //     k: "$_id.date",
      //     v: "$count"
      //   }]
      // }}
      // {$arrayToObject: [{ // MAY BAYAD :(
      //   k: "$_id.date",
      //   v: "$count"
      // }]}
    ]);

    calendarMarks = {};
    for (const entryDate of datesWithEntries) {
      calendarMarks[entryDate.date] = {
        selected: false,
        selectedColor: "#6AC4B1",
        marked: true,
        dotColor: "#6AC4B1",
      };
    }

    res.send(calendarMarks);
  } catch (error) {
    console.log(error);
  }
};
