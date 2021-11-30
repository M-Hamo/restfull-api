const Joi = require("joi");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// for connection
const mongoose = require("mongoose");
require("dotenv").config();

// middle where
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "static")));

// connect to database

const initialMongo = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URI_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((err) => handell(err));
  } catch (err) {
    console.log(err);
  }
};

initialMongo();

// app.use(logger);
// app.get("/", sayHello);

// function logger(req, res, next) {
//   console.log("hey mother fucker");
//   next();
// }

// function sayHello(req, res, next) {
//   res.send("Hello World ...");
//   next();
// }

app.use("/api/data", require("./routes/userRouter"));
app.use("/api/register", require("./routes/registerRouter"));

const port = process.env.PROT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(user, schema);
}
