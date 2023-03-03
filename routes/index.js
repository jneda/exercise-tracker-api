const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => res.status(200).json({ message: "Hello from the API." }));

module.exports = router;
