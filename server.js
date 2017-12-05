const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const mongojs = require("mongojs");
// const expressValidator = require("express-validator");

let index = require("./routes/index");
let profile = require("./routes/profile");
let app = express();
app.set('port', (process.env.PORT || 8000));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

//Set static path
app.use(express.static(path.join(__dirname, 'client')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/profile', profile);

app.listen(app.get('port'), function() {
  console.log(`Node app is running at port: ${app.get('port')}`);
});