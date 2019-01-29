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
    resetPassword: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                body.newPassword = body.newPassword || null;
                body.confirmNewPassword = body.confirmNewPassword || null;
                if (!body.userId || !body.newPassword || !utils.isPassword(body.newPassword) || !body.confirmNewPassword || body.confirmNewPassword !== body.newPassword) {
                    reject([rs.invalidrequest])
                    return;
                }
                model.getNewInstance(body);
                model.readFull().then((result) => {
                    if (!!result) {
                        return pv.create(body.newPassword)
                    } else {
                        throw rs.signin;
                    }
                }).then((hashedPassword) => {
                    return model.update({
                        password: hashedPassword,
                        passwordResetAt: new Date().getTime()
                    })
                }).then(resolve).catch(reject);
            } catch (e) {
                reject(e);
            }
        });
    },
    changePassword: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                body.oldPassword = body.oldPassword || null;
                body.newPassword = body.newPassword || null;
                body.confirmNewPassword = body.confirmNewPassword || null;
                if (!body.oldPassword || !body.userId || !body.newPassword || !utils.isPassword(body.newPassword) || !body.confirmNewPassword || body.confirmNewPassword !== body.newPassword) {
                    reject([rs.invalidrequest])
                    return;
                }
                model.getNewInstance(body);
                model.readFull().then((dbObj) => {
                    if (!!dbObj) {
                        return pv.verify(body.oldPassword, dbObj.password);
                    } else {
                        throw rs.signin;
                    }
                }).then((result) => {
                    if (!!result) {
                        throw rs.invalidrequest;
                    } else {
                        return pv.create(body.newPassword);
                    }
                }).then((hashedPassword) => {
                    return model.update({
                        password: hashedPassword,
                        passwordResetAt: new Date().getTime()
                    })
                }).then(resolve).catch(reject);
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
    },
    resetPassword: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Password Reset Successfully",
                    code: "RESET"
                }]
            })
        };
        service.resetPassword(req.session, req.body).then(successCB, next);
    },
    changePassword: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Password Changed Successfully",
                    code: "RESET"
                }]
            })
        };
        service.changePassword(req.session, req.body).then(successCB, next);
    }
}
module.exports.service = service;
module.exports.router = router;
