var json2xls = require('json2xls');

function writeExcel() {
    require('fs').writeFile('data.xlsx', xls, 'binary',(err)=>{

    });
}

function formatExcel(projects) {
    console.log(JSON.stringify(projects, null, 2))
    return new Promise(async function(resolve, reject) {
        for (var i = 0; i < projects.length; i++) {
            let projectId = projects[i].projectId || null;
            let expenses = projects[i].expenses || [];
            for (var j = 0; j < expenses.length; j++) {
                var xls = json2xls(expenses[j].data);

                let filePath = await writeExcel(expenses[j].type, xls);

                expenses[j].data
            }

        }
        resolve("<b> Data is Ready </b>");
    });
}
module.exports = formatExcel;
