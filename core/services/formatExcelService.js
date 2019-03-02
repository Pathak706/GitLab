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
