const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000

// create express app
const app = express();

// Route Handler
var IgniterRouter = require('./routes/user');

app.set('view engine', 'ejs')
app.use(express.static('public'));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// Route Processing
app.use('/v1/igniter', IgniterRouter);

// listen for requests
app.listen(port);

module.exports = app

