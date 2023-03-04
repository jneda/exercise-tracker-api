const { Router } = require("express");
const controllers = require("../controllers");

const router = Router();

router.get("/", (req, res) =>
  res.status(200).json({ message: "Hello from the API." })
);

router.get("/users", controllers.getAllUsers);

router.post("/users", controllers.createUser);

router.post("/users/:id/exercises", controllers.createExercise);

router.get("/users/:id/logs", controllers.getLog);

module.exports = router;
