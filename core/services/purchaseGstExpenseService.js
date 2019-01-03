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
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                body.expenseId = body.expenseId || utils.getUniqueId();
                body.files = (!!files && !!files.length) ? files : null;
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                model.getNewInstance(body);
                const requiredFields = ['files', 'projectId', 'userId', 'expenseId'];
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
                let expenseId = args[1] || null;
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
                if (!body.expenseId) {
                    return Promise.reject([rs.invalidrequest])
                }
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
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenseId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
                if (!body.expenseId) {
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
                let expenseId = args[1] || null;
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
                if (!body.expenseId) {
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
    getExpenses: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
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
                model.getExpenses(body).then(readAllUsers).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    }
}
let router = {
    create: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expense Created Successfully",
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
                    message: "Expense Read Successfully",
                    code: "READ"
                }],
                expense: data
            })
        };
        service.read(req.session, req.params.expenseId).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expense Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.session, req.params.expenseId, req.body).then(successCB, next);
    },
    getExpenses: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expenses Read Successfully",
                    code: "READ"
                }],
                expenses: data
            })
        };
        service.getExpenses(req.session, req.query).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;
