require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: null,
    database: "exercise_tracker_dev",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "exercise_tracker_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
};
