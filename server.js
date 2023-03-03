const app = require("./app");

const PORT = 3000;

try {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
} catch (error) {
  console.error(error.message);  
}