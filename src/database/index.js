const mongoose = require('mongoose');

mongoose.connect('mongodb://beatrizf13:beatrizf13@ds153304.mlab.com:53304/ndjslogin');
mongoose.Promise = global.Promise;

module.exports = mongoose;