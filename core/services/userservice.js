const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let pv = require("./../commons/passwordVerification");
let service = {
    create: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                body.userId = body.userId || utils.getUniqueId();
                body.firstName = !!body.firstName ? _.capitalize(body.firstName) : "";
                body.lastName = !!body.lastName ? _.capitalize(body.lastName) : "";
                body.password = utils.isPassword(body.password) ? body.password : null;
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                if (!body.password) {
                    reject([rs.invalidrequest]);
                    return;
                }
                pv.create(body.password).then((hashedPassword) => {
                    body.password = hashedPassword;
                    model.getNewInstance(body);
                    model.readUniqueUser().then(() => {
                        // user found  - so cant allow
                        reject([{
                            message: "User Exists",
                            code: "USEREXISTS"
                        }]);
                    }).catch((err) => {
                        const requiredFields = ['userId', 'password', 'firstName', 'lastName', 'gender', 'mobile'];
                        model.getLatestId()
                            .then((prevId) => {
                                body.id = (parseInt(prevId) + 1).toString();
                                model.getNewInstance(body);
                                return model.validate(requiredFields)
                            }, reject)
                            .then(() => model.create()).then(onSuccess).catch(onError)
                    });
                }).catch(onError);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    read: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.read().then((dbObj) => {
                    resolve(dbObj);
                    return;
                }).catch((errors) => {
                    reject(errors);
                    return;
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    update: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let updateObj = args[2] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.update(updateObj).then((dbObj) => {
                    resolve(dbObj);
                    return;
                }).catch((errors) => {
                    reject(errors);
                    return;
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    updateAttributes: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let updateObj = args[2] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.read().then((dbObj) => {
                    let attributes = dbObj.attributes || {};
                    attributes = Object.assign(attributes, updateObj);
                    return model.update({
                        attributes: attributes
                    })

                }).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    delete: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.delete().then((dbObj) => {
                    resolve(dbObj);
                    return;
                }).catch((errors) => {
                    reject(errors);
                    return;
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    deleteAttributes: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let deleteObj = args[2] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.read().then((dbObj) => {
                    let attributes = dbObj.attributes || {};
                    let deleteKeys = Object.keys(deleteObj) || [];
                    for (var i = 0; i < deleteKeys.length; i++) {
                        delete attributes[deleteKeys[i]];
                    }
                    return model.update({
                        attributes: attributes
                    })

                }).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getMe: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let queryParams = args[2] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.read().then((dbObj) => {
                    let jwt = require('./../commons/jwt');;
                    queryParams.fields = !!queryParams.fields && !!queryParams.fields.length ? queryParams.fields.split(",") : []
                    resolve({
                        me: model.getObject(queryParams.fields || []),
                        token: jwt.generate({
                            userId: model.getAttribute('userId'),
                        })
                    });
                    return;
                }).catch((errors) => {
                    reject(errors);
                    return;
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getUsers: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                model.getNewInstance(body);
                model.getUsers(body).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    timeSheetSignIn: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = _session.userId || null;
                let _body = args[2] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let timeSheetModel = require('./../models/timeSheetModel');
                let tsmodel = new timeSheetModel(_session);
                let timesheetId = null;
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.read()
                    .then((dbObj) => {
                        if (!!dbObj.timesheetId) {
                            return Promise.reject([{
                                code: "SESSION",
                                message: "Please Signout First"
                            }]);
                        } else {
                            return tsmodel.getLatestId()
                        }
                    })
                    .then((prevId) => {
                        timesheetId = utils.getUniqueId();
                        let tsBody = {
                            "timesheetId": timesheetId,
                            "year": (new Date().getFullYear()).toString(),
                            "month": ('0' + (new Date().getMonth() + 1)).slice(-2).toString(),
                            "day": ('0' + (new Date().getDate() + 1)).slice(-2).toString(),
                            "userId": "ca4c45f0-4af5-11e9-bb49-4b08cfa293da",
                            "signInTime": new Date().getTime(),
                            "signInLocation": _body.location || "",
                            "signOutTime": null,
                            "signOutLocation": null,
                            "totalMins": null,
                        }
                        tsBody.id = (parseInt(prevId) + 1).toString();
                        tsmodel.getNewInstance(tsBody);
                        return tsmodel.validate([])
                    })
                    .then(() => tsmodel.create())
                    .then(() => {
                        model.getNewInstance(body);
                        return model.update({
                            timesheetId: timesheetId
                        })
                    })
                    .then(resolve)
                    .catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    timeSheetSignOut: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = _session.userId || null;
                let _body = args[2] || {};
                let userModel = require('./../models/usermodel');
                let model = new userModel(_session);
                let timeSheetModel = require('./../models/timeSheetModel');
                let tsmodel = new timeSheetModel(_session);
                let body = {};
                body.userId = userId || null;
                model.getNewInstance(body);
                model.read()
                    .then((dbObj) => {
                        if (!dbObj.timesheetId) {
                            return Promise.reject([{
                                code: "SESSION",
                                message: "Please SignIn First"
                            }]);
                        } else {
                            let tsBody = {
                                timesheetId: dbObj.timesheetId
                            }
                            tsmodel.getNewInstance(tsBody);
                            return tsmodel.read()
                        }
                    })
                    .then((dbObj) => {
                        let ct = new Date().getTime();
                        let updateObj = {
                            signOutLocation: _body.location || "",
                            totalMins: parseInt((ct - dbObj.signInTime) / (1000 * 60)),
                            signOutTime: ct
                        }
                        tsmodel.getNewInstance({
                            timesheetId: dbObj.timesheetId
                        });
                        return tsmodel.update(updateObj);
                    })
                    .then(() => {
                        model.getNewInstance(body);
                        return model.update({
                            timesheetId: null
                        })
                    })
                    .then(resolve)
                    .catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getTimeSheet: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = _session.userId || null;
                let query = args[1] || {};
                let timeSheetModel = require('./../models/timeSheetModel');
                let tsmodel = new timeSheetModel(_session);
                query.date = !!query.date ? parseInt(query.date) : null;
                query.month = !!query.month ? parseInt(query.month) : null;
                query.year = !!query.year ? parseInt(query.year) : null;
                query.userId = userId;
                if (!query.date)
                    delete query.date;
                if (!query.month)
                    delete query.month;
                if (!query.year)
                    delete query.year;
                tsmodel.getNewInstance(query);
                tsmodel.getTimesheets(query).then(resolve).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
}
let router = {
    create: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Created Successfully",
                    code: "CREATED"
                }]
            })
        };
        service.create(req.session, req.body).then(successCB, next);
    },
    read: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Read Successfully",
                    code: "READ"
                }],
                user: data
            })
        };
        service.read(req.session, req.params.userId).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.session, req.params.userId, req.body).then(successCB, next);
    },
    updateAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.updateAttributes(req.session, req.params.userId, req.body).then(successCB, next);
    },
    deleteAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.deleteAttributes(req.session, req.params.userId, req.body).then(successCB, next);
    },
    me: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Me",
                    code: "ME"
                }],
                me: data.me,
                //  token: data.token,
            })
        };
        req.params.userId = req.session.userId;
        service.getMe(req.session, req.params.userId, req.query).then(successCB, next);
    },
    getUsers: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Users Read Successfully",
                    code: "READ"
                }],
                users: data
            })
        };
        service.getUsers(req.session, req.query).then(successCB, next);
    },
    timeSheetSignIn: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "SignIn Successfully",
                    code: "READ"
                }]
            })
        };
        service.timeSheetSignIn(req.session, req.query, req.body).then(successCB, next);
    },
    timeSheetSignOut: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "SignOut Successfully",
                    code: "READ"
                }]
            })
        };
        service.timeSheetSignOut(req.session, req.query, req.body).then(successCB, next);
    },
    getTimeSheet: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "TimeSheet Read Successfully",
                    code: "READ"
                }],
                timesheets: data
            })
        };
        service.getTimeSheet(req.session, req.query).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;