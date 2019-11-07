const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 3000

// create express app
const app = express();
app.use(cors())

// Route Handler
var IgniterRouter = require('./routes/user');

// Express file upload
app.use(fileUpload());

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

