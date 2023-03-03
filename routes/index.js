const { Router } = require("express");
const controllers = require("../controllers");

const router = Router();

router.get("/", (req, res) =>
  res.status(200).json({ message: "Hello from the API." })
);

router.post("/users", controllers.createUser);

module.exports = router;
