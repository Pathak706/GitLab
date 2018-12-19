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
                    model.validate(requiredFields).then(() => model.create()).then(onSuccess).catch(onError)
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

                function readAllUsers(projects) {
                    return new Promise(async function(resolve, reject) {
                        let userObjs = {};
                        for (var i = 0; i < projects.length; i++) {
                            let projUser = [];
                            let users = projects[i].users || []
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
                            projects[i].users = projUser;
                        }
                        return resolve(projects);
                    });
                }
                model.getProjects(body).then(readAllUsers).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getProjectPdf: (...args) => {
        return new Promise(function(resolve, reject) {
            try {
                service.getProjects(args[0], args[1])
                    .then(require('./formatHtmlService'))
                    .then((htmlData) => {
                        return require('./pdfservice')(htmlData, 'utf8');
                    })
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
                user: data
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
    getProjectPdf: (req, res, next) => {
        let successCB = (data) => {
            res.header('Content-type', 'application/pdf');
            res.sendFile(data);
            return;
        };
        service.getProjectPdf(req.session, req.query).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;
