const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const initDatabases = require("./../commons/db");
module.exports = model = class model {
    constructor(object) {
        let instance = this;
        instance._session = object || {};
        instance.tableName = 'paymentRequest'
    };
    getNewInstance(values) {
        let instance = this;
        try {
            instance.dbObject = {};
            instance.dbObject.id = null;
            instance.dbObject.paymentId = null;
            instance.dbObject.userId = null;
            instance.dbObject.projectId = null;
            instance.dbObject.userName = null;
            instance.dbObject.projectName = null;
            instance.dbObject.files = null;
            instance.dbObject.attributes = null;
            instance.dbObject.description = null;
            instance.dbObject.geolocation = null;
            instance.dbObject.totalAmount = null;
            instance.dbObject.totalApprovedAmount = null;
            instance.dbObject.status = null;
            instance.dbObject.created_at = null;
            instance.dbObject.updated_at = null;
            instance.dbObject.created_by = null;
            instance.dbObject.updated_by = null;
            if (!!values && typeof values === "object" && Object.keys(values).length) {
                Object.keys(instance.dbObject).forEach((key) => {
                    if (values.hasOwnProperty(key)) {
                        instance.dbObject[key] = values[key];
                    }
                });
            }
            return instance;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    getAttribute(key) {
        let instance = this;
        if (instance.dbObject.hasOwnProperty(key)) {
            return instance.dbObject[key];
        }
        return null;
    };
    getObject(fields) {
        let instance = this;
        try {
            if (!!instance.dbObject) {
                fields = fields ? fields : [];
                let dbObject = {};
                if (fields.length) {
                    for (let i = 0; i < fields.length; i++) {
                        if (instance.dbObject.hasOwnProperty(fields[i])) {
                            dbObject[fields[i]] = instance.dbObject[fields[i]];
                        }
                    }
                    instance.dbObject = dbObject;
                }
                return instance.dbObject;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    };
    validate(requiredFields) {
        let instance = this;
        return new Promise(function(resolve, reject) {
            try {
                let obj = instance.dbObject || {};
                let errors = [];
                requiredFields = requiredFields || [];
                for (var i = 0; i < requiredFields.length; i++) {
                    if (obj[requiredFields[i]] == null || typeof obj[requiredFields[i]] == "undefined") {
                        errors.push({
                            code: "VALIDATIONERROR",
                            message: requiredFields[i] + " missing",
                            title: "ERROR"
                        });
                    }
                }
                if (!!errors.length) {
                    reject(errors);
                } else {
                    resolve()
                }
            } catch (e) {
                reject(e);
            }
        });
    }
    create() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            instance.dbObject.created_at = new Date().getTime();
            instance.dbObject.updated_at = new Date().getTime();
            instance.dbObject.created_by = (instance._session || {}).userId || null;
            instance.dbObject.updated_by = (instance._session || {}).userId || null;
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).insertOne(instance.dbObject, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        let setObj = {
                            id: "1"
                        };
                        setObj[instance.tableName] = instance.dbObject.id;
                        db.collection("counters").update({
                            id: "1"
                        }, {
                            "$set": setObj
                        }, {
                            upsert: true
                        }, (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                let out = instance.getNewInstance(instance.dbObject);
                                resolve(out.dbObject);
                            }
                        });
                    }
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
    getLatestId() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let key = {
                id: "1"
            }
            let readCallback = (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    result = result || {};
                    resolve(result[instance.tableName] || 0);
                }
            }
            initDatabases('expensemanager').then((db) => {
                db.collection("counters").findOne(key, readCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
    read() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let key = {
                paymentId: (instance.dbObject || {}).paymentId || null
            }
            let readCallback = (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    if (result === null || !Object.keys(result).length) {
                        reject([rs.notfound]);
                    } else {
                        let out = instance.getNewInstance(result);
                        delete out.dbObject.password;
                        resolve(out.dbObject);
                    }
                }
            }
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).findOne(key, readCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
    update(values) {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let toSet = {};
            let findQuery = {
                paymentId: (instance.dbObject || {}).paymentId || null
            }
            if (!!values && typeof values === "object" && Object.keys(values).length) {
                Object.keys(instance.dbObject).forEach((key) => {
                    if (values.hasOwnProperty(key)) {
                        toSet[key] = values[key];
                    }
                });
            };
            toSet['updated_at'] = new Date().getTime();
            toSet['updated_by'] = (instance._session || {}).userId || null;
            let updateCallback = (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    if (!!result.value) {
                        resolve(true);
                    } else {
                        reject([rs.notfound]);
                    }
                }
            };
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).findOneAndUpdate(findQuery, {
                    "$set": toSet
                }, {
                    returnNewDocument: true
                }, updateCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
    delete() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let key = {
                paymentId: (instance.dbObject || {}).paymentId || null
            }
            let removeCallback = (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(null);
                }
            }
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).remove(key, removeCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getPayments(query) {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let key = query;
            let readCallback = (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result || []);
                }
            }
            console.log(key)
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).find(key).toArray(readCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
