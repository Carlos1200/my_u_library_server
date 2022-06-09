const express = require("express");
const cors = require("cors");
const users = require("./routes/users.routes");
const authors = require("./routes/authors.routes");
const genres = require("./routes/genres.routes");
require("dotenv").config();

//creating the server
const app = express();

//use cors
app.use(cors());

//enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//importing routes
app.use("/api/users", users);
app.use("/api/authors", authors);
app.use("/api/genres", genres);

//handling errors
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

//start the server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
