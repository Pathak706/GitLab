const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let service = {
    create: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = utils.clone(args[1] || {});
                let files = args[2] || [];
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                body.expenseId = body.expenseId || utils.getUniqueId();
                body.files = (!!files && !!files.length) ? files : [];
                (body.files).forEach((obj, index) => {
                    return body.files[index] = utils.pick(obj, "mimetype", "filename", "size");
                });
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                body.status = body.status || "PENDING";
                model.getNewInstance(body);
                const requiredFields = ['projectId', 'userId', 'expenseId'];
                let projectAttributes = null;
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
                        projectAttributes = project.attributes || {};
                        if ((project.users || []).indexOf(body.userId) < 0) {
                            return Promise.reject([rs.accessnotgranted])
                        } else {
                            body.projectName = project.projectName || null;
                            return userservice.read(_session, body.userId);
                        }
                    })
                    .then((user) => {
                        body.userName = ((user.firstName || "") + " " + (user.lastName || "")).trim();
                        let toUpdate = {};
                        toUpdate['Pending Approvals'] = projectAttributes['Pending Approvals'] || 0;
                        toUpdate['Pending Approvals'] = toUpdate['Pending Approvals'] + 1;
                        toUpdate['Pending Purchase GST Expenses'] = projectAttributes['Pending Purchase GST Expenses'] || 0;
                        toUpdate['Pending Purchase GST Expenses'] = toUpdate['Pending Purchase GST Expenses'] + 1;
                        return projectservice.updateAttributes(_session, body.projectId, toUpdate);
                    })
                    .then((projObj) => {
                        model.getNewInstance(body);
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
        return new Promise(function (resolve, reject) {
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
                model.read().then(resolve, reject).catch(reject);
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
                model.getExpenses(body).then(resolve, reject);
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
                let expenseId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
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
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenseId = args[1] || null;
                let deleteObj = args[2] || {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
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
    setExcelData: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenses = args[1] || {};
                let template = {}
                template["Id"] = "Id";
                template["User"] = "User";
                template["Description"] = "Description";
                template["No. of bills"] = "No. of bills";
                template["Amount"] = "Amount";
                template["GST Bill"] = "GST Bill";
                template["Approved Amount"] = "Approved Amount";
                template["Status"] = "Status";
                let csv = [];
                for (var i = 0; i < expenses.length; i++) {
                    let projectModel = require('./../models/purchaseGstExpenseModel');
                    let model = new projectModel(_session);
                    model.getNewInstance(expenses[i]);
                    let obj = utils.clone(template);
                    obj["Id"] = model.getAttribute("id") || "";
                    obj["User"] = model.getAttribute("userName") || "";
                    obj["Description"] = model.getAttribute("description") || "";
                    obj["No. of bills"] = (model.getAttribute("files") || []).length;
                    obj["Amount"] = model.getAttribute("totalAmount") || "";
                    obj["GST Bill"] = model.getAttribute("gstBill") || "";
                    obj["Approved Amount"] = model.getAttribute("totalApprovedAmount") || "";
                    obj["Status"] = model.getAttribute("status") || "";
                    csv.push(obj)
                }
                resolve(csv);
                return;
            } catch (e) {
                reject(e);
                return;
            }
        });
    },
    approveExpense: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenseId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
                updateObj.status = updateObj.status || "APPROVED";
                updateObj.totalApprovedAmount = updateObj.totalApprovedAmount || 0;
                let projectId = null;
                let projectObj = null;
                let expenseObj = null;
                model.getNewInstance(body);
                model.read()
                    .then((dbObj) => {
                        expenseObj = dbObj || {};
                        projectId = dbObj.projectId || null;
                        return model.update(updateObj);
                    })
                    .then((dbObj) => {
                        return projectservice.read(_session, projectId);
                    })
                    .then((proj) => {
                        projectObj = proj;
                        let toUpdate = {};
                        toUpdate.attributes = projectObj.attributes || {};
                        toUpdate.attributes['All Expenses'] = parseFloat(toUpdate.attributes['All Expenses'] || 0);
                        toUpdate.attributes['All Expenses'] = toUpdate.attributes['All Expenses'] + parseFloat(updateObj.totalApprovedAmount);
                        toUpdate.attributes['Purchase GST Expenses'] = parseFloat(toUpdate.attributes['Purchase GST Expenses'] || 0);
                        toUpdate.attributes['Purchase GST Expenses'] = toUpdate.attributes['Purchase GST Expenses'] + parseFloat(updateObj.totalApprovedAmount);
                        if (!updateObj.forceApprove) {
                            toUpdate.attributes['Pending Purchase GST Expenses'] = toUpdate.attributes['Pending Purchase GST Expenses'] || 0;
                            toUpdate.attributes['Pending Purchase GST Expenses'] = toUpdate.attributes['Pending Purchase GST Expenses'] - 1;
                            toUpdate.attributes['Pending Approvals'] = toUpdate.attributes['Pending Approvals'] || 0;
                            toUpdate.attributes['Pending Approvals'] = toUpdate.attributes['Pending Approvals'] - 1;
                        }
                        return projectservice.updateAttributes(_session, projectId, toUpdate.attributes);
                    }).then(() => {
                        if ((projectObj.users || []).indexOf(expenseObj.userId) < 0) {
                            return Promise.reject([rs.accessnotgranted])
                        } else {
                            return userservice.read(_session, expenseObj.userId);
                        }
                    })
                    .then((user) => {
                        let attributes = user.attributes || {};
                        attributes['Balance'] = parseFloat(attributes['Balance'] || 0);
                        attributes['Balance'] = attributes['Balance'] - parseFloat(updateObj.totalApprovedAmount);
                        return userservice.update(_session, expenseObj.userId, {
                            attributes: attributes
                        });
                    })
                    .then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    forceRejectExpense: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenseId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
                updateObj.status = updateObj.status || "REJECTED";
                let projectId = null;
                let projectObj = null;
                let expenseObj = null;
                model.getNewInstance(body);
                model.read()
                    .then((dbObj) => {
                        expenseObj = dbObj || {};
                        projectId = dbObj.projectId || null;
                        return model.update({
                            status: updateObj.status,
                            totalApprovedAmount: null
                        });
                    })
                    .then((dbObj) => {
                        return projectservice.read(_session, projectId);
                    })
                    .then((proj) => {
                        projectObj = proj;
                        let toUpdate = {};
                        toUpdate.attributes = projectObj.attributes || {};
                        toUpdate.attributes['All Expenses'] = parseFloat(toUpdate.attributes['All Expenses'] || 0);
                        toUpdate.attributes['All Expenses'] = toUpdate.attributes['All Expenses'] - parseFloat(expenseObj.totalApprovedAmount);
                        toUpdate.attributes['Purchase GST Expenses'] = parseFloat(toUpdate.attributes['Purchase GST Expenses'] || 0);
                        toUpdate.attributes['Purchase GST Expenses'] = toUpdate.attributes['Purchase GST Expenses'] - parseFloat(expenseObj.totalApprovedAmount);
                        return projectservice.updateAttributes(_session, projectId, toUpdate.attributes);
                    }).then(() => {
                        if ((projectObj.users || []).indexOf(expenseObj.userId) < 0) {
                            return Promise.reject([rs.accessnotgranted])
                        } else {
                            return userservice.read(_session, expenseObj.userId);
                        }
                    })
                    .then((user) => {
                        let attributes = user.attributes || {};
                        attributes['Balance'] = parseFloat(attributes['Balance'] || 0);
                        attributes['Balance'] = attributes['Balance'] + parseFloat(expenseObj.totalApprovedAmount);
                        return userservice.update(_session, expenseObj.userId, {
                            attributes: attributes
                        });
                    })
                    .then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    rejectExpense: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenseId = args[1] || null;
                let updateObj = {};
                let projectModel = require('./../models/purchaseGstExpenseModel');
                let projectservice = require('./projectservice').service;
                let model = new projectModel(_session);
                let body = {};
                body.expenseId = expenseId || null;
                updateObj.status = updateObj.status || "REJECTED";
                let projectId = null;
                model.getNewInstance(body);
                model.read()
                    .then((dbObj) => {
                        projectId = dbObj.projectId || null;
                        return model.update(updateObj);
                    })
                    .then((dbObj) => {
                        return projectservice.read(_session, projectId);
                    })
                    .then((projectObj) => {
                        let toUpdate = {};
                        toUpdate.attributes = projectObj.attributes || {};
                        toUpdate.attributes['Pending Purchase GST Expenses'] = toUpdate.attributes['Pending Purchase GST Expenses'] || 0;
                        toUpdate.attributes['Pending Purchase GST Expenses'] = toUpdate.attributes['Pending Purchase GST Expenses'] - 1;
                        toUpdate.attributes['Pending Approvals'] = toUpdate.attributes['Pending Approvals'] || 0;
                        toUpdate.attributes['Pending Approvals'] = toUpdate.attributes['Pending Approvals'] - 1;
                        return projectservice.updateAttributes(_session, projectId, toUpdate.attributes);
                    })
                    .then(resolve, reject);
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
    },
    updateAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expenses Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.updateAttributes(req.session, req.params.expenseId, req.body).then(successCB, next);
    },
    deleteAttributes: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expenses Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.deleteAttributes(req.session, req.params.expenseId, req.body).then(successCB, next);
    },
    approveExpense: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expenses Approved",
                    code: "UPDATED"
                }]
            })
        };
        service.approveExpense(req.session, req.params.expenseId, req.body).then(successCB, next);
    },
    rejectExpense: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expenses Rejected",
                    code: "UPDATED"
                }]
            })
        };
        service.rejectExpense(req.session, req.params.expenseId, req.body).then(successCB, next);
    },
    forceRejectExpense: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Expenses Rejected",
                    code: "UPDATED"
                }]
            })
        };
        service.forceRejectExpense(req.session, req.params.expenseId, req.body).then(successCB, next);
    },
};
module.exports.service = service;
module.exports.router = router;