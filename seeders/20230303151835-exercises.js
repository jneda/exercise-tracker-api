"use strict";
const { User } = require("../models");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await User.findAll();

    await queryInterface.bulkInsert(
      "Exercises",
      [
        {
          _id: uuidv4(),
          description: "Take the trash for a walk",
          duration: 10,
          date: new Date("1970"),
          userId: users[0]._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: uuidv4(),
          description: "Take the dog out",
          duration: 5,
          date: new Date("1982"),
          userId: users[0]._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: uuidv4(),
          description: "Sleep",
          duration: 20,
          date: new Date("1986"),
          userId: users[1]._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Exercises", null, {});
  },
};
