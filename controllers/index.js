const { Exercise, User } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

async function createUser(req, res) {
  try {
    const { username } = req.body;
    const user = await User.create({ username });
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: err.message });
  }
}

async function createExercise(req, res) {
  try {
    const { id: userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    let { description, duration, date } = req.body;
    // set default date if not provided by user
    if (!date) {
      date = new Date();
    } else {
      date = new Date(date);
    }
    date = date.toISOString();

    let exercise = await Exercise.create(
      {
        description,
        duration,
        date,
        userId,
      },
      { raw: true }
    );
    // needed to get duration as int...
    await exercise.reload();

    return res.status(201).send({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ error: error.message });
  }
}

async function getLog(req, res) {
  console.log("req.params:", JSON.stringify(req.query, null, 2));

  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    // check for from, to, and limit parameters
    const { from, to, limit } = req.query;

    const searchDateFormat = "YYYY-MM-DD";

    let fromDate;
    if (from) {
      try {
        fromDate = moment(from, searchDateFormat).toISOString();
        console.log("fromDate condition:", fromDate && { [Op.gte]: new Date(fromDate) });
      } catch (error) {
        console.error("Invalid date format.");
      }
    }

    let toDate;
    if (to) {
      try {
        toDate = moment(to, searchDateFormat).toISOString();
        console.log("toDate condition:", toDate && { [Op.lte]: new Date(toDate) });
      } catch (error) {
        console.error("Invalid date format.");
      }
    }

    const dateOptions = {
      ...(fromDate ? { [Op.gte]: new Date(fromDate) } : null),
      ...(toDate ? { [Op.lte]: new Date(toDate) } : null),
    };

    console.log("dateOptions", JSON.stringify(dateOptions, null, 2));

    const exercises = await Exercise.findAll({
      where: {
        userId: user._id,
        // ...dateOptions,
      },
      ...(limit && { limit: parseInt(limit) }),
    });

    const log = exercises.map((exercise) => {
      const { description, duration, date } = exercise;
      return { description, duration, date: new Date(date).toDateString() };
    });

    return res.status(200).send({
      _id: user._id,
      username: user.username,
      count: log.length,
      log,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  createExercise,
  getLog,
};
