const MongoClient = require('mongodb').MongoClient
const config = require('./../configs/config');
var f = require('util').format;
let connStrings = [];
for (var i = 0; i < config.db.databases.length; i++) {
    let db = config.db.databases[i];
    //    connStrings.push(f(db.endpoint + '/' + db.dbname.toLowerCase() + '?authMechanism=%s', encodeURIComponent(db.username), encodeURIComponent(db.password), db.authMechanism));
    connStrings.push("mongodb://localhost:27017/" + db.dbname.toLowerCase())
}
let databases = null;

function connect(url) {
    return MongoClient.connect(url, {
        useNewUrlParser: true
    }).then(client => client.db())
}

module.exports = async function(dbName) {
    try {
        if (!!databases) {} else {
            databases = databases || [];
            for (var i = 0; i < connStrings.length; i++) {
                databases[i] = await connect(connStrings[i]);
            }
        }
        let connections = {};
        for (var i = 0; i < config.db.databases.length; i++) {
            if (!!dbName && config.db.databases[i].dbname === dbName) {
                return databases[i];
            }
            connections[config.db.databases[i].dbname] = databases[i];
        }
        return connections;
    } catch (e) {
        return null;
    }
}
