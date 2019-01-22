const jwt = require('jsonwebtoken');
const secretKey = "u37xrn732tnr7193g1rg1lawhco8313rvJYRW3UBTURCC8ednfje";
const defaultOptions = {
    algorithm: 'HS256',
    noTimestamp: false,
    expiresIn: '30d'
};
let service = {}
service.generate = (payload, signOptions) => {
    return jwt.sign(payload || {}, secretKey, Object.assign({}, defaultOptions, signOptions));
};
service.validate = (token) => {
    return new Promise(function(resolve, reject) {
        try {
            let result = jwt.verify(token, secretKey);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};
service.verifyRequest = (req, res, next) => {
    let token = (req.headers['authorization'] || "").split('Bearer ')[1] || "";
    token = token || req.query.token || "";
    service.validate(token).then((payload) => {
        req.session = payload;
        next();
    }).catch(e => next(e));
};
module.exports = service;
