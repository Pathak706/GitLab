const rs = require("./../commons/responses");
let pv = require("./../commons/passwordVerification");
let log = require("./../commons/logger");
const utils = require("./../commons/utils");
let service = {
    signin: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                body.mobile = utils.isMobile(body.username) ? body.username : null;
                body.email = utils.isEmail(body.username) ? body.username : null;
                model.getNewInstance(body);
                model.signInRead().then((dbObj) => {
                    return pv.verify(body.password, dbObj.password);
                }).then((result) => {
                    if (!!result) {
                        let userservice = require('./userservice').service;
                        return userservice.getMe(_session, model.getAttribute('userId'), {});
                    }
                    throw rs.signin;
                }).then((dbObj) => {
                    resolve(dbObj);
                    return;
                }).catch((errors) => {
                    console.log(errors)
                    reject([rs.signin]);
                    return;
                })
            } catch (e) {
                reject(e);
            }
        });
    },
};
let router = {
    signin: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Sign In Successfully",
                    code: "SIGNIN"
                }],
                me: data.me,
                token: data.token
            })
        };
        service.signin(req.session, req.body).then(successCB, next);
    }
}
module.exports.service = service;
module.exports.router = router;
