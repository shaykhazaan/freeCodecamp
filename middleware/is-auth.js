const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.body.accessToken;
    if(!token) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'accessTokenKey');
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 402;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};