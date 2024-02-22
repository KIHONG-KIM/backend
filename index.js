const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;
app.use("/public", express.static("public"));

require("dotenv").config();