// authMiddleware.js
const basicAuth = require('basic-auth');

const auth = (req, res, next) => {
    const user = basicAuth(req);
    const username = process.env.AUTH_USER;
    const password = process.env.AUTH_PASS;

    if (user && user.name === username && user.pass === password) {
        return next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm="Employee API"');
        return res.status(401).send('Authentication required.');
    }
};

module.exports = auth;