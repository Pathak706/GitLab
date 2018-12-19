let ms = require('ms');
let onFinished = require('on-finished');
let onHeaders = require('on-headers');
let log = require('./logger');

let onTimeout = (delay, req, cb) => {
    return () => {
        cb([{
            message: "API Timeout",
            code: "TIMEDOUT"
        }]);
    };
}
module.exports = {
    cors: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    },
    error40x: (err, req, res, next) => {
        let response = err;
        if ((err || {}).code == 'LIMIT_UNEXPECTED_FILE') {
            response = [{
                message: err.code,
                code: "ERRORUPLOAD"
            }];
        }
        if (!Array.isArray(response) && !!response.message) {
            response = [{
                "message": response.message,
                "code": "EXCEPTION",
            }]
        } else if (!Array.isArray(response)) {
            response = [{
                "message": "Caught an Exception",
                "code": "EXCEPTION",
            }]
        }
        let responseObject = {
            result: "failure",
            response: response
        };
        res.json(responseObject);
    },
    error404: (req, res, next) => {
        let responseObject = {
            result: "failure",
            response: [{
                "message": "This api doesnt exist.",
                "code": "404ERROR"
            }]
        }
        log.error("This API does not Exist : " + req.method + " " + req.url);
        res.json(responseObject);
    },
    apiTimeout: (time) => {
        let delay = typeof time === 'string' ? ms(time) : Number(time || 5000);
        return (req, res, next) => {
            let id = setTimeout(() => {
                req.timedout = true;
                req.emit('timeout', delay);
            }, delay);

            req.on('timeout', onTimeout(delay, req, next));
            req.clearTimeout = () => {
                clearTimeout(id);
            };
            req.timedout = false;
            onFinished(res, () => {
                clearTimeout(id);
            });
            onHeaders(res, () => {
                clearTimeout(id);
            });
            next();
        };
    },
};
