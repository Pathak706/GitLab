let authservice = require('./../services/authservice').router;
let userservice = require('./../services/userservice').router;
let projectservice = require('./../services/projectservice').router;
let fileservice = require('./../services/fileservice');
let transportationExpenseService = require('./../services/transportationExpenseService').router;
let accomodationExpenseService = require('./../services/accomodationExpenseService').router;
let foodAndBeverageExpenseService = require('./../services/foodAndBeverageExpenseService').router;
let miscellaneousExpenseService = require('./../services/miscellaneousExpenseService').router;
let purchaseGstExpenseService = require('./../services/purchaseGstExpenseService').router;
let localConveyanceExpenseService = require('./../services/localConveyanceExpenseService').router;
let projectExpenseService = require('./../services/projectExpenseService').router;
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
    versionRouter.post('/expenses/transportation-expenses', jwt.verifyRequest, fileservice.expenseCreateRequest, transportationExpenseService.create);
    versionRouter.get('/expenses/transportation-expenses/:expenseId', jwt.verifyRequest, transportationExpenseService.read);
    versionRouter.get('/expenses/transportation-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/transportation-expenses/:expenseId', jwt.verifyRequest, transportationExpenseService.update);
    versionRouter.get('/expenses/transportation-expenses/', jwt.verifyRequest, transportationExpenseService.getExpenses);

    versionRouter.post('/expenses/accomodation-expenses', jwt.verifyRequest, fileservice.expenseRequest, accomodationExpenseService.create);
    // versionRouter.get('/expenses/accomodation-expenses/:expenseId', jwt.verifyRequest, accomodationExpenseService.read);
    // versionRouter.get('/expenses/accomodation-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    // versionRouter.put('/expenses/accomodation-expenses/:expenseId', jwt.verifyRequest, accomodationExpenseService.update);
    // versionRouter.get('/expenses/accomodation-expenses/', jwt.verifyRequest, accomodationExpenseService.getExpenses);
    //
    // versionRouter.post('/expenses/food-and-beverage-expenses', jwt.verifyRequest, fileservice.expenseRequest, foodAndBeverageExpenseService.create);
    // versionRouter.get('/expenses/food-and-beverage-expenses/:expenseId', jwt.verifyRequest, foodAndBeverageExpenseService.read);
    // versionRouter.get('/expenses/food-and-beverage-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    // versionRouter.put('/expenses/food-and-beverage-expenses/:expenseId', jwt.verifyRequest, foodAndBeverageExpenseService.update);
    // versionRouter.get('/expenses/food-and-beverage-expenses/', jwt.verifyRequest, foodAndBeverageExpenseService.getExpenses);
    //
    // versionRouter.post('/expenses/miscellaneous-expenses', jwt.verifyRequest, fileservice.expenseRequest, miscellaneousExpenseService.create);
    // versionRouter.get('/expenses/miscellaneous-expenses/:expenseId', jwt.verifyRequest, miscellaneousExpenseService.read);
    // versionRouter.get('/expenses/miscellaneous-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    // versionRouter.put('/expenses/miscellaneous-expenses/:expenseId', jwt.verifyRequest, miscellaneousExpenseService.update);
    // versionRouter.get('/expenses/miscellaneous-expenses/', jwt.verifyRequest, miscellaneousExpenseService.getExpenses);
    //
    // versionRouter.post('/expenses/purchase-gst', jwt.verifyRequest, fileservice.expenseRequest, purchaseGstExpenseService.create);
    // versionRouter.get('/expenses/purchase-gst/:expenseId', jwt.verifyRequest, purchaseGstExpenseService.read);
    // versionRouter.get('/expenses/purchase-gst/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    // versionRouter.put('/expenses/purchase-gst/:expenseId', jwt.verifyRequest, purchaseGstExpenseService.update);
    // versionRouter.get('/expenses/purchase-gst/', jwt.verifyRequest, purchaseGstExpenseService.getExpenses);
    //
    // versionRouter.post('/expenses/local-conveyance-expenses', jwt.verifyRequest, fileservice.expenseRequest, localConveyanceExpenseService.create);
    // versionRouter.get('/expenses/local-conveyance-expenses/:expenseId', jwt.verifyRequest, localConveyanceExpenseService.read);
    // versionRouter.get('/expenses/local-conveyance-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    // versionRouter.put('/expenses/local-conveyance-expenses/:expenseId', jwt.verifyRequest, localConveyanceExpenseService.update);
    // versionRouter.get('/expenses/local-conveyance-expenses/', jwt.verifyRequest, localConveyanceExpenseService.getExpenses);
    //
    // versionRouter.post('/expenses/project-expenses', jwt.verifyRequest, fileservice.expenseRequest, projectExpenseService.create);
    // versionRouter.get('/expenses/project-expenses/:expenseId', jwt.verifyRequest, projectExpenseService.read);
    // versionRouter.get('/expenses/project-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    // versionRouter.put('/expenses/project-expenses/:expenseId', jwt.verifyRequest, projectExpenseService.update);
    // versionRouter.get('/expenses/project-expenses/', jwt.verifyRequest, projectExpenseService.getExpenses);
    /* Expenses Routes */



    return versionRouter;
}
