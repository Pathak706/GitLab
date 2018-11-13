const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let service = {
    create: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let projectModel = require('./../models/transportationExpenseModel');
                let model = new projectModel(_session);
                body.expenseId = body.expenseId || utils.getUniqueId();
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                model.getNewInstance(body);
                const requiredFields = ['projectId', 'userId', 'expenseId'];
                model.validate(requiredFields).then(() => model.create()).then(onSuccess).catch(onError)
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
                let projectModel = require('./../models/transportationExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
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
                let projectModel = require('./../models/transportationExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
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
                let projectModel = require('./../models/transportationExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
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
                let projectModel = require('./../models/transportationExpenseModel');
                let model = new projectModel(_session);
                if (!Object.keys(body).length) {
                    reject([rs.invalidrequest])
                    return;
                }
                model.getNewInstance({});
                if (!!body.users) {
                    body.users = {
                        $in: body.users.split(",")
                    };
                }
                model.getExpenses(body).then(resolve, reject);
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
        service.create(req.session, req.body).then(successCB, next);
    },
    read: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expense Read Successfully",
                    code: "READ"
                }],
                user: data
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
                projects: data
            })
        };
        service.getExpenses(req.session, req.query).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;