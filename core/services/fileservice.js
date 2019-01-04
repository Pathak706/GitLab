let service = {};
var multer = require('multer');
const utils = require("./../commons/utils");
var fs = require('fs');
var path = require('path');
service.expenseCreateRequest = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback) {
            let dir = process.cwd() + '/../upload/expenses/';
            let expenseType = req.url.split("/");
            expenseType = expenseType[expenseType.length - 1];
            dir = dir + expenseType + "/";
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: function(req, file, callback) {
            //console.log(JSON.stringify(file, null, 2))
            let filename = "File_" + utils.getUniqueId() + "_" + (file.originalname).split(" ").join("").split("/").join("");
            callback(null, filename);
        },
        onError: function(err, callback) {
            let error = {
                "title": "ERROR",
                "message": "Error in file upload",
                "code": "MULTERERROR"
            }
            callback([error]);
        }
    }),
}).array('filesupload', 15);
service.requestPaymentCreateRequest = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback) {
            let dir = process.cwd() + '/../upload/requests/';
            let expenseType = req.url.split("/");
            expenseType = expenseType[expenseType.length - 1];
            dir = dir + expenseType + "/";
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: function(req, file, callback) {
            console.log(JSON.stringify(file, null, 2))
            let filename = "File_" + utils.getUniqueId() + "_" + (file.originalname).split(" ").join("").split("/").join("");
            callback(null, filename);
        },
        onError: function(err, callback) {
            let error = {
                "title": "ERROR",
                "message": "Error in file upload",
                "code": "MULTERERROR"
            }
            callback([error]);
        }
    }),
}).array('filesupload', 15);
service.expenseReadFileRequest = (req, res, next) => {
    //let expenseId = req.params.expenseId || null;
    let fileName = req.params.filename || null;
    let expenseType = req.url.split("/");
    res.sendFile(path.resolve(process.cwd() + "/../upload/expenses/" + expenseType[2] + "/" + fileName));
};
service.requestPaymentReadFileRequest = (req, res, next) => {
    //let paymentId = req.params.paymentId || null;
    let fileName = req.params.filename || null;
    let expenseType = req.url.split("/");
    res.sendFile(path.resolve(process.cwd() + "/../upload/requests/" + expenseType[2] + "/" + fileName));
};
module.exports = service;
