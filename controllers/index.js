const { Exercise, User } = require("../models");

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
  // console.log("reached createExercise route");
  try {
    const { id: userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    let { description, duration, date } = req.body;
    date = new Date(date).toISOString();
    // console.log("body:", { ...req.body, date: date });

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
    return res.status(500).send({ error: error.message });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  createExercise,
};
