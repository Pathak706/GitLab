const _ = require("lodash");
const uuid = require('uuid');
let service = {};
service.clone = (o) => {
    if (typeof o === "object") {
        return _.clone(o)
    } else {
        return o;
    }
};
service.getUniqueId = () => {
    return uuid.v1();
};
service.isEmail = (email) => {
    email = email || "";
    var regex = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/
    return regex.test(email);
}
service.isMobile = (mobile) => {
    mobile = mobile || "";
    var regex = /^[987]\d{9}$/
    return regex.test(mobile);
}
service.isPassword = (pass) => {
    pass = pass || ""
    return (pass.length >= 6 && pass.length <= 26);
}
service.isGender = (gender) => {
    gender = gender || "";
    var regex = /^Male$|^Female$|^Other$/
    return regex.test(gender);
}
service.strictString = (value) => {
    return (!_.isUndefined(value) && !_.isNull(value) && _.isString(value) && !_.isEmpty(value));
}
service.stringOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || _.isString(value))
}
service.strictInt = (value) => {
    return (!_.isUndefined(value) && !_.isNull(value) && _.isNumber(value));
}
service.intOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || _.isNumber(value))
}
service.emailOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || (_.isString(value) && service.isEmail(value)))
}
service.mobileOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || (_.isString(value) && service.isMobile(value)))
}
service.genderOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || (_.isString(value) && service.isGender(value)))
}
service.strictObject = (value) => {
    return (!_.isUndefined(value) && !_.isNull(value) && _.isPlainObject(value) && !_.isEmpty(value));
}
service.objectOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || _.isPlainObject(value));
}
service.strictArray = (value) => {
    return (!_.isUndefined(value) && !_.isNull(value) && _.isArray(value) && !_.isEmpty(value));
}
service.arrayOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || _.isArray(value));
}
service.strictBoolean = (value) => {
    return (!_.isUndefined(value) && !_.isNull(value) && _.isBoolean(value));
}
service.booleanOrNothing = (value) => {
    return (_.isUndefined(value) || _.isNull(value) || _.isBoolean(value))
}
module.exports = service;
