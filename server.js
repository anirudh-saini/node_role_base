const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db/db");
const routes = require("./routes/routes");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", routes);
app.listen(3200, () => {
  console.log("running");
});
