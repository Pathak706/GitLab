let authservice = require('./../services/authservice').router;
let userservice = require('./../services/userservice').router;
let projectservice = require('./../services/projectservice').router;
let transportationExpenseService = require('./../services/transportationExpenseService').router;
let jwt = require('./../commons/jwt');
module.exports = (express) => {
    let versionRouter = express.Router();

    /* Me Call */
    versionRouter.get('/me', jwt.verifyRequest, userservice.me);
    /* Me Call */

    /* Auth Routes */
    versionRouter.post('/auth/signin', authservice.signin);
    /* Auth Routes */


    /* User Routes */
    versionRouter.post('/users', userservice.create);
    versionRouter.get('/users/:userId', userservice.read);
    versionRouter.put('/users/:userId', userservice.update);
    //versionRouter.delete('/users/:userId', userservice.delete);
    /* User Routes */

    /* Project Routes */
    versionRouter.post('/projects', jwt.verifyRequest, projectservice.create);
    versionRouter.get('/projects', jwt.verifyRequest, projectservice.getProjects);
    versionRouter.get('/projects/:projectId', jwt.verifyRequest, projectservice.read);
    versionRouter.put('/projects/:projectId', jwt.verifyRequest, projectservice.update);
    /* Project Routes */


    /* Expenses Routes */
    versionRouter.post('/expenses/transportation-expenses', jwt.verifyRequest, transportationExpenseService.create);
    versionRouter.get('/expenses/transportation-expenses/:expenseId', jwt.verifyRequest, transportationExpenseService.read);
    versionRouter.put('/expenses/transportation-expenses/:expenseId', jwt.verifyRequest, transportationExpenseService.update);
    versionRouter.get('/expenses/transportation-expenses/', jwt.verifyRequest, transportationExpenseService.getExpenses);

    versionRouter.post('/expenses/accomodation-expenses', jwt.verifyRequest, accomodationExpenseService.create);
    versionRouter.get('/expenses/accomodation-expenses/:expenseId', jwt.verifyRequest, accomodationExpenseService.read);
    versionRouter.put('/expenses/accomodation-expenses/:expenseId', jwt.verifyRequest, accomodationExpenseService.update);

    versionRouter.post('/expenses/food-and-beverage-expenses', jwt.verifyRequest, foodAndBeverageExpenseService.create);
    versionRouter.get('/expenses/food-and-beverage-expenses/:expenseId', jwt.verifyRequest, foodAndBeverageExpenseService.read);
    versionRouter.put('/expenses/food-and-beverage-expenses/:expenseId', jwt.verifyRequest, foodAndBeverageExpenseService.update);

    versionRouter.post('/expenses/miscellaneous-expenses', jwt.verifyRequest, miscellaneousExpenseService.create);
    versionRouter.get('/expenses/miscellaneous-expenses/:expenseId', jwt.verifyRequest, miscellaneousExpenseService.read);
    versionRouter.put('/expenses/miscellaneous-expenses/:expenseId', jwt.verifyRequest, miscellaneousExpenseService.update);

    versionRouter.post('/expenses/purchase-gst', jwt.verifyRequest, purchaseGstExpenseService.create);
    versionRouter.get('/expenses/purchase-gst/:expenseId', jwt.verifyRequest, purchaseGstExpenseService.read);
    versionRouter.put('/expenses/purchase-gst/:expenseId', jwt.verifyRequest, purchaseGstExpenseService.update);

    versionRouter.post('/expenses/local-conveyance-expenses', jwt.verifyRequest, localConveyanceExpenseService.create);
    versionRouter.get('/expenses/local-conveyance-expenses/:expenseId', jwt.verifyRequest, localConveyanceExpenseService.read);
    versionRouter.put('/expenses/local-conveyance-expenses/:expenseId', jwt.verifyRequest, localConveyanceExpenseService.update);

    versionRouter.post('/expenses/project-expenses', jwt.verifyRequest, projectExpenseService.create);
    versionRouter.get('/expenses/project-expenses/:expenseId', jwt.verifyRequest, projectExpenseService.read);
    versionRouter.put('/expenses/project-expenses/:expenseId', jwt.verifyRequest, projectExpenseService.update);
    /* Expenses Routes */

    /expenses/transportation - expenses
        /
        expenses / transportation - expenses /
        expenses / transportation - expenses /: id


    return versionRouter;
}
