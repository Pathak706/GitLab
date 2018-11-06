var bcrypt = require('bcrypt');
const saltRounds = 6;
module.exports.create = (text) => {
    return bcrypt.hash(text, saltRounds);
}
module.exports.verify = (text, exHash) => {
    return bcrypt.compare(text, exHash);
}
