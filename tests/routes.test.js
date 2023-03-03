const request = require("supertest");
const app = require("../app");
const { v4: uuidv4, validate: validateUuid } = require("uuid");

describe("Exercise tracker API", () => {
  it("should create a new user from form data", async () => {
    const usernameInput = "Toto  Totovitch  Totov";
    const formData = `username=${encodeURIComponent(usernameInput)}`;

    const response = await request(app).post("/api/users").send(formData);
    expect(response.statusCode).toEqual(201);

    const user = response.body;
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("_id");

    const { _id, username } = user;
    expect(validateUuid(_id)).toBe(true);
    expect(username).toEqual(usernameInput);
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
});
