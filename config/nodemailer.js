const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, MAIL_ACCOUNT } = require("./env");

const auth = {
    type: "OAuth2",
    user: MAIL_ACCOUNT,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
}

module.exports = { auth };

