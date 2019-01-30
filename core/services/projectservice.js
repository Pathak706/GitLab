const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
const fs = require('fs')
let pv = require("./../commons/passwordVerification");
let service = {
    create: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                body.projectId = body.projectId || utils.getUniqueId();
                body.projectName = !!body.projectName ? _.capitalize(body.projectName) : "";
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                model.getNewInstance(body);
                model.readUniqueProject().then(() => {
                    // user found  - so cant allow
                    reject([{
                        message: "Project Exists",
                        code: "PROJECTEXISTS"
                    }]);
                }).catch((err) => {
                    const requiredFields = ['projectId', 'projectName', 'users'];
                    model.getLatestId()
                        .then((prevId) => {
                            body.id = (parseInt(prevId) + 1).toString();
                            model.getNewInstance(body);
                            return model.validate(requiredFields)
                        }, reject)
                        .then(() => {
                            return model.create()
                        }, reject)
                        .then(resolve, reject)
                });
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
                let projectId = args[1] || null;
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                let body = {};
                body.projectId = projectId || null;
                model.getNewInstance(body);
                model.read().then(resolve).catch(reject);
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
                let projectId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                let body = {};
                body.projectId = projectId || null;
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
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let projectId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                let body = {};
                body.projectId = projectId || null;
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
                let projectId = args[1] || null;
                let deleteObj = args[2] || {};
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                let body = {};
                body.projectId = projectId || null;
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
    delete: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let projectId = args[1] || null;
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                let body = {};
                body.projectId = projectId || null;
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
    getProjects: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let projectModel = require('./../models/projectmodel');
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                // if (!Object.keys(body).length) {
                //     reject([rs.invalidrequest])
                //     return;
                // }
                let qKeys = Object.keys(body) || []
                for (var i = 0; i < qKeys.length; i++) {
                    if (!body[qKeys[i]]) {
                        delete body[qKeys[i]];
                    }
                }
                model.getNewInstance({});
                if (!!body.users) {
                    body.users = {
                        $in: body.users.split(",")
                    };
                }
                model.getProjects(body).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getProjectUsers: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                let _session = args[0] || {};
                let projectId = args[1].projectId || null;
                let projectModel = require('./../models/projectmodel');
                let model = new projectModel(_session);
                let body = {};
                body.projectId = projectId || null;
                model.getNewInstance(body);

                function readAllUsers(project) {
                    let userservice = require('./userservice').service;
                    return new Promise(async function(resolve, reject) {
                        let userObjs = {};
                        let projUser = [];
                        let users = project.users || []
                        for (var j = 0; j < users.length; j++) {
                            if (!!userObjs[users[j]]) {
                                projUser.push(userObjs[users[j]]);
                            } else {
                                let u = await userservice.read(_session, users[j]).catch((e) => {
                                    reject(e);
                                    return;
                                });
                                if (!!u) {
                                    delete u.permissions;
                                    userObjs[u.userId] = u;
                                    projUser.push(u);
                                } else {
                                    reject([rs.invalidrequest]);
                                    return;
                                }
                            }
                        }
                        return resolve(projUser);
                    });
                }
                model.read().then(readAllUsers).then(resolve).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getProjectExcel: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                function getExpensesOfEachType(projects) {
                    let expenses = [{
                            type: "Accomodation Expenses",
                            get: require('./accomodationExpenseService').service.getExpenses,
                            excel: require('./accomodationExpenseService').service.setExcelData
                        }
                        /*, {
                                                type: "Food And Beverage Expenses",
                                                get: require('./foodAndBeverageExpenseService').service.getExpenses,
                                                excel: require('./foodAndBeverageExpenseService').service.setExcelData
                                            }, {
                                                type: "Local Convetance Expenses",
                                                get: require('./localConveyanceExpenseService').service.getExpenses,
                                                excel: require('./localConveyanceExpenseService').service.setExcelData
                                            }, {
                                                type: "Miscellaneous Expenses",
                                                get: require('./miscellaneousExpenseService').service.getExpenses,
                                                excel: require('./miscellaneousExpenseService').service.setExcelData
                                            }, {
                                                type: "Purchase GST Expenses",
                                                get: require('./purchaseGstExpenseService').service.getExpenses,
                                                excel: require('./purchaseGstExpenseService').service.setExcelData
                                            }, {
                                                type: "Transportation Expenses",
                                                get: require('./transportationExpenseService').service.getExpenses,
                                                excel: require('./transportationExpenseService').service.setExcelData
                                            }, {
                                                type: "Request Payment",
                                                get: require('./requestPaymentService').service.getPayments,
                                                excel: require('./requestPaymentService').service.setExcelData
                                            }*/
                    ];
                    return new Promise(async function(resolve, rej) {
                        for (var j = 0; j < projects.length; j++) {
                            let projectExpenses = [];
                            for (var i = 0; i < expenses.length; i++) {
                                let expenseData = await expenses[i].get(args[0], {
                                    projectId: projects[j].projectId,
                                    users: args[1].users || null
                                }).catch(e => {
                                    return rej(e)
                                });
                                expenseData = expenseData || [];
                                let excelData = "";
                                if (!!expenses[i].excel) {
                                    excelData = await expenses[i].excel(args[0], expenseData).catch(e => {
                                        return rej(e)
                                    });
                                }
                                let ex = {
                                    type: expenses[i].type,
                                    data: excelData
                                };
                                ex.data = ex.data || "";
                                projectExpenses.push(ex);
                            };
                            projects[j].expenses = projectExpenses
                        }
                        resolve(projects);
                    });
                }
                if (!args[1].projectId || !args[1].type || args[1].type !== "xlsx") {
                    reject([rs.invalidrequest]);
                    return;
                }
                service.getProjects(args[0], args[1])
                    .then(getExpensesOfEachType)
                    .then(require('./formatExcelService'))
                    .then(resolve)
                    .catch(reject);
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
                    message: "Project Created Successfully",
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
                    message: "Project Read Successfully",
                    code: "READ"
                }],
                project: data
            })
        };
        service.read(req.session, req.params.projectId).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Project Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.session, req.params.projectId, req.body).then(successCB, next);
    },
    updateAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Project Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.updateAttributes(req.session, req.params.projectId, req.body).then(successCB, next);
    },
    deleteAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Project Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.deleteAttributes(req.session, req.params.projectId, req.body).then(successCB, next);
    },
    getProjects: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Projects Read Successfully",
                    code: "READ"
                }],
                projects: data
            })
        };
        service.getProjects(req.session, req.query).then(successCB, next);
    },
    getProjectUsers: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Projects Users Read Successfully",
                    code: "READ"
                }],
                users: data
            })
        };
        service.getProjectUsers(req.session, req.params).then(successCB, next);
    },
    getProjectExcel: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Projects Excel Set Successfully",
                    code: "EXCEL"
                }],
                xlsx: data
            })
        };
        service.getProjectExcel(req.session, req.query).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;
