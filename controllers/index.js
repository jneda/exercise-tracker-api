const { User } = require("../models");

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

module.exports = {
  createUser,
};
