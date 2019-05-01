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
                let projectModel = require('./../models/requestPaymentModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                body.paymentId = body.paymentId || utils.getUniqueId();
                body.files = (!!files && !!files.length) ? files : [];
                (body.files).forEach((obj, index) => {
                    return body.files[index] = utils.pick(obj, "mimetype", "filename", "size");
                });
                body.status = body.status || "PENDING";
                let onSuccess = (dbObj) => {
                    resolve(dbObj);
                };
                let onError = (errors) => {
                    reject(errors);
                };
                model.getNewInstance(body);
                const requiredFields = ['projectId', 'userId', 'paymentId'];
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
                        toUpdate['Pending Payment Requests'] = projectAttributes['Pending Payment Requests'] || 0;
                        toUpdate['Pending Payment Requests'] = toUpdate['Pending Payment Requests'] + 1;
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
                let paymentId = args[1] || null;
                let projectModel = require('./../models/requestPaymentModel');
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
                if (!body.paymentId) {
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
                model.getPayments(body).then(resolve, reject);
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
        return new Promise(function (resolve, reject) {
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
    setExcelData: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let expenses = args[1] || {};
                let template = {}
                template["Id"] = "Id";
                template["User"] = "User";
                template["Description"] = "Description";
                template["No. of Attachments"] = "No. of Attachments";
                template["Amount"] = "Amount";
                template["Approved Amount"] = "Approved Amount";
                template["Status"] = "Status";
                let csv = [];
                for (var i = 0; i < expenses.length; i++) {
                    let projectModel = require('./../models/requestPaymentModel');
                    let model = new projectModel(_session);
                    model.getNewInstance(expenses[i]);
                    let obj = utils.clone(template);
                    obj["Id"] = model.getAttribute("id") || "";
                    obj["User"] = model.getAttribute("userName") || "";
                    obj["Description"] = model.getAttribute("description") || "";
                    obj["No. of Attachments"] = (model.getAttribute("files") || []).length;
                    obj["Amount"] = model.getAttribute("totalAmount") || "";
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
    approvePayment: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/requestPaymentModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
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
                        toUpdate.attributes['Payment Requests'] = parseFloat(toUpdate.attributes['Payment Requests'] || 0);
                        toUpdate.attributes['Payment Requests'] = toUpdate.attributes['Payment Requests'] + parseFloat(updateObj.totalApprovedAmount);
                        if (!updateObj.forceApprove) {
                            toUpdate.attributes['Pending Payment Requests'] = toUpdate.attributes['Pending Payment Requests'] || 0;
                            toUpdate.attributes['Pending Payment Requests'] = toUpdate.attributes['Pending Payment Requests'] - 1;
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
                        attributes['Balance'] = attributes['Balance'] + parseFloat(updateObj.totalApprovedAmount);
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
    forceRejectPayment: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let updateObj = args[2] || {};
                let projectModel = require('./../models/transportationExpenseModel');
                let projectservice = require('./projectservice').service;
                let userservice = require('./userservice').service;
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
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
                        toUpdate.attributes['Payment Requests'] = parseFloat(toUpdate.attributes['Payment Requests'] || 0);
                        toUpdate.attributes['Payment Requests'] = toUpdate.attributes['Payment Requests'] - parseFloat(expenseObj.totalApprovedAmount);
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
                        attributes['Balance'] = attributes['Balance'] - parseFloat(expenseObj.totalApprovedAmount);
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
    rejectPayment: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let paymentId = args[1] || null;
                let updateObj = {};
                let projectModel = require('./../models/transportationExpenseModel');
                let projectservice = require('./projectservice').service;
                let model = new projectModel(_session);
                let body = {};
                body.paymentId = paymentId || null;
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
                        toUpdate.attributes['Pending Payment Requests'] = toUpdate.attributes['Pending Payment Requests'] || 0;
                        toUpdate.attributes['Pending Payment Requests'] = toUpdate.attributes['Pending Payment Requests'] - 1;
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
    approvePayment: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payment Approved",
                    code: "UPDATED"
                }]
            })
        };
        service.approvePayment(req.session, req.params.paymentId, req.body).then(successCB, next);
    },
    rejectPayment: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payment Rejected",
                    code: "UPDATED"
                }]
            })
        };
        service.rejectPayment(req.session, req.params.paymentId, req.body).then(successCB, next);
    },
    forceRejectPayment: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Payment Rejected",
                    code: "UPDATED"
                }]
            })
        };
        service.forceRejectPayment(req.session, req.params.paymentId, req.body).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;
