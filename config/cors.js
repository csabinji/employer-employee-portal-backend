const cors = require('cors');
const corsOptionsDelegate = (req, callback) => {
  const host = req.get('origin');

  const corsOptions = {
    credentials: true,
    methods: `GET, POST, PUT, DELETE, OPTIONS`,
    origin: `*`,
  };

  callback(null, corsOptions);
};

module.exports = cors(corsOptionsDelegate);
