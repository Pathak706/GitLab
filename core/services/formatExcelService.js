//var json2xls = require('json2xls');
var Excel = require('exceljs');

function writeExcel(_id, _data) {
    return new Promise(function(resolve, reject) {
        let fn = _id + '.xlsx';
        _data.xlsx.writeFile(process.cwd() + '/../xlsx/' + fn)
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
    //             "type": "Local Conveyance Expenses",
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
        var mainSheet = workbook.addWorksheet("Summary");
        mainSheet.getCell('A1').value = "Project Summary";

        mainSheet.getCell('A3').value = "Name";
        mainSheet.getCell('B3').value = project.projectName || "";

        mainSheet.getCell('A4').value = "Category";
        mainSheet.getCell('B4').value = project.projectCategory || "";

        mainSheet.getCell('A5').value = "Client";
        mainSheet.getCell('B5').value = project.projectClient || "";

        mainSheet.getCell('A6').value = "Location";
        mainSheet.getCell('B6').value = project.projectLocation || "";

        mainSheet.getCell('A7').value = "Budget";
        mainSheet.getCell('B7').value = (project.attributes || {}).Budget || (project.attributes || {}).budget || "";

        mainSheet.getCell('A8').value = "Status";
        mainSheet.getCell('B8').value = (project.attributes || {}).Status || (project.attributes || {}).status || "";

        mainSheet.getCell('A10').value = "Users";
        mainSheet.getCell('B10').value = "";

        mainSheet.getCell('D3').value = "All Expenses";


        // mainSheet.getCell('D4').value = "Transportation Expenses";
        // mainSheet.getCell('E4').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D5').value = "Accomodation Expenses";
        // mainSheet.getCell('E5').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D6').value = "F & B Expenses";
        // mainSheet.getCell('E6').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D7').value = "Miscellaneous Expenses";
        // mainSheet.getCell('E7').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D8').value = "Purchase GST";
        // mainSheet.getCell('E8').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D9').value = "Local Conveyance";
        // mainSheet.getCell('E9').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D10').value = "Created At";
        // mainSheet.getCell('E10').value = new Date(project.created_at);
        //
        // mainSheet.getCell('D12').value = "Created At";
        // mainSheet.getCell('E12').value = new Date(project.created_at);
        let typeStartCol = 4
        let totalSum = 0;
        for (var j = 0; j < project.expenses.length; j++) {
            let expense = project.expenses[j];
            mainSheet.getCell('D' + typeStartCol).value = expense.type;
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
                let sum = 0;
                for (var k = 0; k < expense.data.length; k++) {
                    sum = sum + parseFloat(expense.data[k].Amount || "0")
                    totalSum = totalSum + parseFloat(expense.data[k].Amount || "0")
                }
                mainSheet.getCell('E' + typeStartCol).value = sum;

                sheet.addRows(expense.data);
            } else {

            }
            typeStartCol++;
        }
        mainSheet.getCell('E3').value = totalSum;
        let path = await writeExcel(project.projectId, workbook);
        //let out = !!projects[0] ? projects[0].excelData : {};
        resolve(path || 'noPath');
    });
}
module.exports = formatExcel;
