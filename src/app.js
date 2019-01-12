const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//import routes
const indexRoute = require('./routes/indexRoute');
const userRouther = require('./routes/userRoute');
const projectRoute = require('./routes/projectRoute');
const taskRoute = require('./routes/taskRoute');

//creating routes
app.use('/', indexRoute);
app.use('/users', userRouther);
app.use('/projects', projectRoute);
app.use('/tasks', taskRoute);

module.exports = app;