const request = require("supertest");
const app = require("../app");
const { v4: uuidv4, validate: validateUuid } = require("uuid");
const { User } = require("../models");
const moment = require("moment");

describe("Exercise tracker API", () => {
  it("should create a new user from form data", async () => {
    const userData = {
      username: "Toto  Totovitch  Totov",
    };
    const formUrlencoded = toFormUrlEncoded(userData);

    const response = await request(app).post("/api/users").send(formUrlencoded);
    expect(response.statusCode).toEqual(201);

    const user = response.body;
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("_id");

    const { _id, username } = user;
    expect(validateUuid(_id)).toBe(true);
    expect(username).toEqual(userData.username);
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.statusCode).toEqual(200);

    const users = response.body;
    expect(users).toBeInstanceOf(Array);

    function isValidUser(user) {
      return user.username !== undefined && user._id !== undefined;
    }

    const allUsersAreValid = users.every((user) => isValidUser(user));
    expect(allUsersAreValid).toBe(true);
  });

  it("should create a new exercise from form data", async () => {
    const user = await User.findOne();
    const date = new Date();

    const exerciseData = {
      description: "Go for a walk",
      duration: 60,
      date: date,
    };
    const formUrlencoded = toFormUrlEncoded(exerciseData);

    // console.log("test formData:", formUrlencoded);

    const requestURL = `/api/users/${user._id}/exercises`;

    const response = await request(app).post(requestURL).send(formUrlencoded);
    expect(response.statusCode).toEqual(201);

    const exercise = response.body;
    expect(exercise).toEqual({
      _id: user._id,
      username: user.username,
      description: exerciseData.description,
      duration: exerciseData.duration,
      date: exerciseData.date.toDateString(),
    });
  });

  it("should get an object with a count property when requesting GET /api/users/:_id/logs", async () => {
    const user = await User.findOne();
    const requestURL = `/api/users/${user._id}/logs`;

    const response = await request(app).get(requestURL);
    expect(response.statusCode).toEqual(200);

    const actual = response.body;
    expect(actual).toHaveProperty("count");
  });

  it("should get an object carrying the user object when requesting GET /api/users/:_id/logs", async () => {
    const user = await User.findOne();
    const requestURL = `/api/users/${user._id}/logs`;

    const response = await request(app).get(requestURL);
    expect(response.statusCode).toEqual(200);

    const actual = response.body;
    expect(actual._id).toEqual(user._id);
    expect(actual.username).toEqual(user.username);
  });

  it("should get a log array when requesting GET /api/users/:_id/logs", async () => {
    const user = await User.findOne();
    const requestURL = `/api/users/${user._id}/logs`;

    const response = await request(app).get(requestURL);
    expect(response.statusCode).toEqual(200);

    const actual = response.body;
    expect(actual).toHaveProperty("log");
    expect(actual.log).toBeInstanceOf(Array);
  });

  it("should get a log array containing exercise-like objects when requesting GET /api/users/:_id/logs", async () => {
    const user = await User.findOne();
    const requestURL = `/api/users/${user._id}/logs`;

    const response = await request(app).get(requestURL);
    expect(response.statusCode).toEqual(200);

    const actual = response.body;
    actual.log.forEach((item) => {
      expect(Object.keys(item)).toEqual(["description", "duration", "date"]);
      expect(item.description).toEqual(expect.any(String));
      expect(item.duration).toEqual(expect.any(Number));
      expect(item.date).toEqual(expect.any(String));
    });
  });
});

describe("GET request to `/api/users/:_id/logs`", () => {
  it("should accept from, to and limit query parameters", async () => {
    const user = await User.findOne();
    const requestURL = `/api/users/${user._id}/logs`;

    const queryObject = {
      from: moment().subtract(7, "days").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      limit: 42,
    };

    const params = new URLSearchParams(queryObject);
    console.log("params:", params);

    const response = await request(app).get(`${requestURL}?${params}`);
    expect(response.status).toEqual(200);
  });

  it("should only fetch results whose date is comprised between from and to paramater dates", async () => {
    const user = await User.findOne();
    const requestURL = `/api/users/${user._id}/logs`;

    const queryObject = {
      from: moment("1982").format("YYYY-MM-DD"),
    };

    const params = new URLSearchParams(queryObject);
    console.log("params:", params);

    const response = await request(app).get(`${requestURL}?${params}`);
    expect(response.status).toEqual(200);

    const actual = response.body;
    expect(actual.count).toEqual(1);
  });
});

function toFormUrlEncoded(obj) {
  let formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value);
  }
  return new URLSearchParams(formData).toString();
}
