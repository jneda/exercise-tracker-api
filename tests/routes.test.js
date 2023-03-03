const request = require("supertest");
const app = require("../app");

describe("Exercise tracker API", () => {
  it("should create a new user from form data", async () => {
    const formData = "username=Toto%20Totovitch%20Totov";
    const response = await request(app).post("/api/users").send(formData);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("_id");
  });
});
