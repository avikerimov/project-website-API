const users = require("./routes/users");
const bizUsers = require("./routes/bizUsers");
const userAuth = require("./routes/userAuth");
const bizAuth = require("./routes/bizAuth");
const ads = require("./routes/ads");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/project-website-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(cors());
app.use(express.json());

app.use("/api/users", users);
app.use("/api/biz-users", bizUsers);
app.use("/api/user-auth", userAuth);
app.use("/api/biz-auth", bizAuth);
app.use("/api/ads", ads);

const port = 3939;
http.listen(port, () => console.log(`Listening on port ${port}...`));
