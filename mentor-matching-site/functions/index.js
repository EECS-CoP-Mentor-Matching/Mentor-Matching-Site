const functions = require('firebase-functions');
const docusign = require('docusign-esign');
const querystring = require('querystring');

const CLIENT_ID = '1957a7ae-8ae4-448b-94dd-9165702fc641';
const CLIENT_SECRET = 'efa95a04-2377-4b3a-b18b-717be2b8c5c9';
const REDIRECT_URI = 'http://localhost:3000/auth/docusign/callback';
const BASE_PATH = 'https://account-d.docusign.com';

exports.getOAuthToken = functions.https.onRequest((req, res) => {
    const { code } = req.query;
    const basePath = 'https://account-d.docusign.com';

    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(basePath);
    apiClient.setOAuthBasePath(basePath.replace('/v2', ''));

    apiClient.generateAccessToken(CLIENT_ID, CLIENT_SECRET, code)
        .then((response) => {
            res.send(response.body);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

exports.getAuthorizationUrl = functions.https.onRequest((req, res) => {
    const state = 'a_random_state_value'; // Using random value for security
    const authUri = `${BASE_PATH}/oauth/auth?${querystring.stringify({
        response_type: 'code',
        scope: 'signature impersonation',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        state: state,
    })}`;
    res.redirect(authUri);
});
