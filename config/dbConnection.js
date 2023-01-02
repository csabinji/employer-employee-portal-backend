const mongoose = require('mongoose');
const { MONGO_DB_URL, APP_DEBUG } = require(`../config/env`);

// Set up default mongoose connection
mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('debug', APP_DEBUG);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.once('connected', async () => {
    console.log('connection to database successful');
});
db.on('error', async (err) => {
    console.log('Error in mongodb connection: ', err);
    db.disconnect();
});

module.exports = { mongoose };

