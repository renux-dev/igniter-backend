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
<<<<<<< HEAD
app.use('/uploads', express.static('uploads'));
=======
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

>>>>>>> 8886dbdb1e6e0076755ee559796b5ee79cd36c58
// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// Route Processing

app.use('/v1/igniter', IgniterRouter);

// listen for requests
app.listen(port);

module.exports = app

