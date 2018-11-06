module.exports = {
    port: 9090,
    db: {
        system: "MONGO",
        databases: [{
            endpoint: "mongodb://%s:%s@localhost:27017",
            dbname: "expensemanager",
            username: "",
            password: "",
            authMechanism: "DEFAULT"
        }]
    }
}
