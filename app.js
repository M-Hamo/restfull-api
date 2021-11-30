const Joi = require("joi");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// for connection
const mongoose = require("mongoose");
require("dotenv").config();

const { graphqlHTTP } = require("express-graphql");

const { schema } = require("./graphql/graphql-schema");

// middle where
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "static")));

/**
 * @description This function is responsible for connecting with mongodb by using mongoose
 */
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

// app.use("/api/data", require("./routes/userRouter"));
// app.use("/api/register", require("./routes/registerRouter"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

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
