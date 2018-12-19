var fs = require('fs');
var pdf = require('html-pdf');
let defaultOptions = {
    "format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
    "orientation": "portrait", // portrait or landscape
    "border": {
        "top": "1cm", // default is 0, units: mm, cm, in, px
        "right": "1cm",
        "bottom": "1cm",
        "left": "0.5cm"
    },
    "paginationOffset": 1, // Override the initial pagination number
    "header": {
        "height": "20mm",
        "contents": '<div style="text-align: center;">Expense Manager</div>'
    },
    "footer": {
        "height": "15mm",
        "contents": {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        }
    },
    "type": "pdf", // allowed file types: png, jpeg, pdf
    "quality": "75", // only used for types png & jpeg
    "timeout": 60000, // Timeout that will cancel phantomjs, in milliseconds
}

function convert(html, options) {
    return new Promise(function(resolve, reject) {
        html = html || "<p> Empty Content </p>";
        let destination = process.cwd() + "/pdfs/" + (new Date().getTime()) + ".pdf"
        pdf.create(html, Object.assign(defaultOptions, options || {})).toFile(destination, function(err, res) {
            if (err)
                return reject(err);
            else
                return resolve(destination);
        });
    });
};
module.exports = convert;
