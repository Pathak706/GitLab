//var json2xls = require('json2xls');
var Excel = require('exceljs');

function writeExcel(_id, _data) {
    return new Promise(function(resolve, reject) {
        let fn = _id + '.xlsx';
        _data.xlsx.writeFile(fn)
            .then(function() {
                resolve("v1/projects/xlsx/" + fn);
            }).catch(e => reject(err));
        // require('fs').writeFile(process.cwd() + '/../xlsx/' + fn, _data, 'binary', (err) => {
        //     if (err) {
        //         return reject(err);
        //     } else {
        //         resolve("v1/projects/xlsx/" + fn);
        //         return;
        //     }
        // });
    });

}

function formatExcel(projects) {
    console.log(JSON.stringify(projects, null, 2));
    // [{
    //     "_id": "5c6a5e06bd602d416b4504ec",
    //     "id": "3",
    //     "projectId": "6fedc570-334e-11e9-9e5d-8170ff4f30f0",
    //     "projectName": "Test Project",
    //     "projectCategory": "Category",
    //     "projectClient": "Client",
    //     "projectLocation": "Location",
    //     "users": [
    //         "695e5810-3294-11e9-b537-03664fae2bb3"
    //     ],
    //     "attributes": {
    //         "Budget": "50000",
    //         "Status": "Active",
    //         "All Expenses": 0,
    //         "Transportation Expenses": 0,
    //         "Accomodation Expenses": 0,
    //         "F&B Expenses": 0,
    //         "Miscellaneous Expenses": 0,
    //         "Purchase GST": 0,
    //         "Local Conveyance Expenses": 0,
    //         "Payment Requests": 0,
    //         "Pending Approvals": 0
    //     },
    //     "created_at": 1550474758985,
    //     "updated_at": 1550474758985,
    //     "created_by": "695e5810-3294-11e9-b537-03664fae2bb3",
    //     "updated_by": "695e5810-3294-11e9-b537-03664fae2bb3",
    //     "expenses": [{
    //             "type": "Accomodation Expenses",
    //             "data": []
    //         },
    //         {
    //             "type": "Food And Beverage Expenses",
    //             "data": []
    //         },
    //         {
    //             "type": "Local Convetance Expenses",
    //             "data": []
    //         },
    //         {
    //             "type": "Miscellaneous Expenses",
    //             "data": []
    //         },
    //         {
    //             "type": "Purchase GST Expenses",
    //             "data": [{
    //                     "Id": "1",
    //                     "User": "John Doe",
    //                     "Description": "",
    //                     "No of bills": "Field Unknown",
    //                     "GST Bill": "",
    //                     "Amount": "100",
    //                     "Approved Amount": "",
    //                     "Status": "Status Unknown"
    //                 },
    //                 {
    //                     "Id": "2",
    //                     "User": "John Doe",
    //                     "Description": "",
    //                     "No of bills": "Field Unknown",
    //                     "GST Bill": "Yes",
    //                     "Amount": "120",
    //                     "Approved Amount": "",
    //                     "Status": "Status Unknown"
    //                 },
    //                 {
    //                     "Id": "3",
    //                     "User": "John Doe",
    //                     "Description": "",
    //                     "No of bills": "Field Unknown",
    //                     "GST Bill": "",
    //                     "Amount": "1200",
    //                     "Approved Amount": "",
    //                     "Status": "Status Unknown"
    //                 }
    //             ]
    //         },
    //         {
    //             "type": "Transportation Expenses",
    //             "data": [{
    //                 "Id": "1",
    //                 "User": "John Doe",
    //                 "Mode of Transport": "",
    //                 "Type": "Field Unknown",
    //                 "Payment": "Field Unknown",
    //                 "No of bills": "Field Unknown",
    //                 "Amount": "100",
    //                 "Approved Amount": "",
    //                 "Status": "Status Unknown"
    //             }]
    //         },
    //         {
    //             "type": "Request Payment",
    //             "data": [{
    //                 "Id": "1",
    //                 "User": "John Doe",
    //                 "Description": "",
    //                 "Attachment": "Field Unknown",
    //                 "Amount": "1000",
    //                 "Approved Amount": "",
    //                 "Status": "Status Unknown"
    //             }]
    //         }
    //     ]
    // }]


    return new Promise(async function(resolve, reject) {

        let project = projects[0];
        var workbook = new Excel.Workbook();
        workbook.created = new Date();
        for (var j = 0; j < project.expenses.length; j++) {
            let expense = project.expenses[j];
            var sheet = workbook.addWorksheet(expense.type);
            if (!!expense.data && !!expense.data.length) {
                let columns = Object.keys(expense.data[0]);
                let cols = [];
                for (var k = 0; k < columns.length; k++) {
                    cols.push({
                        header: columns[k],
                        key: columns[k]
                    });
                }
                sheet.columns = cols;
                sheet.addRows(expense.data);
            } else {
                continue;
            }
        }
        let path = await writeExcel(project.projectId, workbook);
        //let out = !!projects[0] ? projects[0].excelData : {};
        resolve(path || 'noPath');
    });
}
module.exports = formatExcel;
