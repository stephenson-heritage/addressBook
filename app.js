const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const debug = require("debug")("express:server");
const bodyParser = require("body-parser");
const app = express();
const dbLayer = require("./config/db");
const cors = require("cors");

const addressBookRouter = require("./routes/api/addressBook");

const port = 9000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.options("*", cors());
app.use(cookieParser());

app.use("/inc", express.static(path.join(__dirname, "inc")));

app.use("/api/addressBook", addressBookRouter);

app.listen(port, function() {
	dbLayer.init();
	debug("WebAPI App " + port + "!");
});
