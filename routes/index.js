const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => res.json({ message: "Hello from the API." }));

module.exports = router;
