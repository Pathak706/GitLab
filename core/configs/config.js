module.exports = {
    port: 9009,
    db: {
        system: "MONGO",
        databases: [{
            endpoint: "mongodb://%s:%s@localhost:27017",
            dbname: "expensemanager",
            username: "ndttExpenseManager",
            password: "ndttPassword@$^Expense",
            authMechanism: "DEFAULT"
        }]
    }
}
