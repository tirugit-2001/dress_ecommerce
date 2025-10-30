const app = require("./app");
const { envConfig } = require("./config");

const PORT = envConfig.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
