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
  console.log("reached createExercise route");
  try {
    const { id: _id } = req.params;
    const user = await User.findByPk(_id);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    const { description, duration, date } = req.body;
    console.log("body:", req.body);
    console.log("description:", description);
    console.log("duration:", duration);
    console.log("date:", date);
    const exercise = await Exercise.create({ description, duration, date });
    console.log("exercise", exercise);
    await exercise.setUser(user);

    return res.status(201).send({ ...exercise, ...user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  return res.send("coucou !");
}

module.exports = {
  createUser,
  getAllUsers,
  createExercise,
};
