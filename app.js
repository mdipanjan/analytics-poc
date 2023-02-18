require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const authRoute = require("./routes/balance");

const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoute);

const httpPort = process.env.HTTP_PORT || 8000;
const httpServer = http.createServer(app);
httpServer.listen(httpPort);
console.log(
  `HTTP Server Started At http://${process.env.HTTP_URL}:${httpPort}`
);
