var json2xls = require('json2xls');

function writeExcel(_id, _type, _data) {
    return new Promise(function(resolve, reject) {
        let fn = _id + '_' + _type.split(" ").join("") + '.xlsx'
        require('fs').writeFile(process.cwd() + '/../xlsx/' + fn, _data, 'binary', (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve("v1/projects/xlsx/" + fn);
                return;
            }
        });
    });

}

function formatExcel(projects) {
    console.log(JSON.stringify(projects, null, 2));
    return new Promise(async function(resolve, reject) {
        for (var i = 0; i < projects.length; i++) {
            let projectId = projects[i].projectId || null;
            let expenses = projects[i].expenses || [];
            projects[i].excelData = projects[i].excelData || {};
            for (var j = 0; j < expenses.length; j++) {
                var xls = json2xls(expenses[j].data);
                let filePath = await writeExcel(projectId, expenses[j].type, xls);
                projects[i].excelData[expenses[j].type] = filePath;
            }
        }
        resolve(projects[0].excelData);
    });
}
module.exports = formatExcel;
