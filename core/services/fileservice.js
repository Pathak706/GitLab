let service = {};
var multer = require('multer');
const utils = require("./../commons/utils");
var fs = require('fs')
service.expenseCreateRequest = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback) {
            let dir = process.cwd() + '/upload/';
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
            let filename = "File_" + utils.getUniqueId() + "_" + file.originalname;
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
    let expenseId = req.params.expenseId || null;
    let fileName = req.params.filename || null;
    let expenseType = req.url.split("/");
    res.sendFile(process.cwd() + "/upload/" + expenseType[2] + "/" + fileName);
};
module.exports = service;
