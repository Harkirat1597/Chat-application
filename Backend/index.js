require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api", require(path.join(__dirname, './Routes/routes.js')));

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})
