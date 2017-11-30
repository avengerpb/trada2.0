const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");

let app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});