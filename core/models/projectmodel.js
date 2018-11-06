const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const initDatabases = require("./../commons/db");
module.exports = model = class model {
    constructor(object) {
        let instance = this;
        instance._session = object || {};
        instance.tableName = 'projects'
    };
    getNewInstance(values) {
        let instance = this;
        try {
            instance.dbObject = {};
            instance.dbObject.projectId = null;
            instance.dbObject.projectName = null;
            instance.dbObject.users = null;
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
    validate() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            try {
                let obj = instance.dbObject || {};
                let errors = [];
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
            let createCallback = (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    let out = instance.getNewInstance(instance.dbObject);
                    resolve(out.dbObject);
                }
            };
            instance.dbObject.created_at = new Date().getTime();
            instance.dbObject.updated_at = new Date().getTime();
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).insertOne(instance.dbObject, createCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
    read() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let key = {
                projectId: (instance.dbObject || {}).projectId || null
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
                projectId: (instance.dbObject || {}).projectId || null
            }
            if (!!values && typeof values === "object" && Object.keys(values).length) {
                Object.keys(instance.dbObject).forEach((key) => {
                    if (values.hasOwnProperty(key)) {
                        toSet[key] = values[key];
                    }
                });
            };
            toSet['updated_at'] = new Date().getTime();
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
                projectId: (instance.dbObject || {}).projectId || null
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
    readUniqueProject() {
        let instance = this;
        return new Promise(function(resolve, reject) {
            let key = {
                projectName: (instance.dbObject || {}).projectName
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
    getProjects(query) {
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
            initDatabases('expensemanager').then((db) => {
                db.collection(instance.tableName).find(key).toArray(readCallback);
            }).catch(err => {
                reject(err);
            });
        });
    }
}