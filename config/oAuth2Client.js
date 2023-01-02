const { google } = require("googleapis");
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, REDIRECT_URL} = require("./env");

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = oAuth2Client;