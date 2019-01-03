const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let service = {
    create: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = utils.clone(args[1] || {});
                let files = args[2] || [];
                let projectModel = require('./../models/requestPaymentModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                body.paymentId = body.paymentId || utils.getUniqueId();
                body.files = (!!files && !!files.length) ? files : null;
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                model.getNewInstance(body);
                const requiredFields = ['files', 'projectId', 'userId', 'paymentId'];
                model.getLatestId()
                    .then((prevId) => {
                        body.id = (parseInt(prevId) + 1).toString();
                        model.getNewInstance(body);
                        return model.validate(requiredFields)
                    })
                    .then(() => {
                        return projectservice.read(_session, body.projectId);
                    })
                    .then((project) => {
                        if ((project.users || []).indexOf(body.userId) < 0) {
                            return Promise.reject([rs.accessnotgranted])
                        } else {
                            return userservice.read(_session, body.userId);
                        }
                    })
                    .then(() => {
                        return model.create()
                    })
                    .then(onSuccess)
                    .catch(onError)
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    read: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
                if (!body.paymentId) {
                    return Promise.reject([rs.invalidrequest])
                }
                model.getNewInstance(body);
                function readUser(expense) {
                    let userservice = require('./userservice').service;
                    return new Promise(async function(resolve, reject) {
                        let u = await userservice.read(_session, expense.userId).catch((e) => {
                            reject(e);
                            return;
                        });
                        if (!!u) {
                            delete u.permissions;
                            expense.user = u;
                        } else {
                            reject([rs.invalidrequest]);
                            return;
                        }
                        return resolve(expense);
                    });
                }
                model.read().then(readUser).then(resolve, reject).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    update: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
                if (!body.paymentId) {
                    return Promise.reject([rs.invalidrequest])
                }
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
    delete: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
                if (!body.paymentId) {
                    return Promise.reject([rs.invalidrequest])
                }
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
    getPayments: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                // if (!Object.keys(body).length) {
                //     reject([rs.invalidrequest])
                //     return;
                // }
                model.getNewInstance({});
                if (!!body.users) {
                    body.userId = {
                        $in: body.users.split(",")
                    };
                }
                delete body.users;
                function readAllUsers(expenses) {
                    let userservice = require('./userservice').service;
                    return new Promise(async function(resolve, reject) {
                        let userObjs = {};
                        for (var i = 0; i < expenses.length; i++) {
                            let userId = expenses[i].userId || null
                            if (!!userObjs[userId]) {
                                expenses[i].user = userObjs[userId];
                            } else {
                                let u = await userservice.read(_session, userId).catch((e) => {
                                    reject(e);
                                    return;
                                });
                                if (!!u) {
                                    delete u.permissions;
                                    userObjs[u.userId] = u;
                                    expenses[i].user = u;
                                } else {
                                    reject([rs.invalidrequest]);
                                    return;
                                }
                            }
                        }
                        return resolve(expenses);
                    });
                }
                model.getPayments(body).then(readAllUsers).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    updateAttributes: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
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
    deleteAttributes: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let deleteObj = args[2] || {};
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
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
}
let router = {
    create: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payment Created Successfully",
                    code: "CREATED"
                }]
            })
        };
        service.create(req.session, req.body, req.files).then(successCB, next);
    },
    read: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payment Read Successfully",
                    code: "READ"
                }],
                payment: data
            })
        };
        service.read(req.session, req.params.paymentId).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payment Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.session, req.params.paymentId, req.body).then(successCB, next);
    },
    getPayments: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payments Read Successfully",
                    code: "READ"
                }],
                payments: data
            })
        };
        service.getPayments(req.session, req.query).then(successCB, next);
    },
    updateAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payments Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.updateAttributes(req.session, req.params.paymentId, req.body).then(successCB, next);
    },
    deleteAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payments Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.deleteAttributes(req.session, req.params.paymentId, req.body).then(successCB, next);
    },
};
module.exports.service = service;
module.exports.router = router;
