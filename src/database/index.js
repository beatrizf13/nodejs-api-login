const mongoose = require('mongoose');

mongoose.connect('mongodb://beatrizf13:beatrizf13@ds253804.mlab.com:53804/nodejs-api-tasks', { useNewUrlParser: true });

mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise;

module.exports = mongoose;