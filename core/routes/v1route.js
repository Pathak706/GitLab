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
let requestPaymentService = require('./../services/requestPaymentService').router;
let jwt = require('./../commons/jwt');
module.exports = (express) => {
    let versionRouter = express.Router();

    /* Me Call */
    versionRouter.get('/me', jwt.verifyRequest, userservice.me);
    /* Me Call */

    /* Auth Routes */
    versionRouter.post('/auth/signin', authservice.signin);
    versionRouter.post('/auth/resetpassword', authservice.resetPassword);
    versionRouter.post('/auth/changepassword', jwt.verifyRequest, authservice.changePassword);
    /* Auth Routes */


    /* User Routes */
    versionRouter.post('/users', userservice.create);
    versionRouter.get('/users/:userId', userservice.read);
    versionRouter.put('/users/:userId', userservice.update);
    versionRouter.get('/users', jwt.verifyRequest, userservice.getUsers);
    versionRouter.put('/users/:userId/attributes', jwt.verifyRequest, userservice.updateAttributes);
    versionRouter.delete('/users/:userId/attributes', jwt.verifyRequest, userservice.deleteAttributes);
    //versionRouter.delete('/users/:userId', userservice.delete);
    /* User Routes */

    /* Project Routes */
    versionRouter.post('/projects', jwt.verifyRequest, projectservice.create);
    versionRouter.get('/projects', jwt.verifyRequest, projectservice.getProjects);
    versionRouter.get('/projects/export', jwt.verifyRequest, projectservice.getProjectExcel);
    versionRouter.get('/projects/xlsx/:filename', jwt.verifyRequest, (req, res, next) => {
        if (!req.params.filename) {
            next([])
            return;
        } else {
            res.sendFile(require("path").resolve(process.cwd() + '/../xlsx/' + req.params.filename));
            return
        }
    });
    //versionRouter.get('/projects/pdf', jwt.verifyRequest, projectservice.getProjectPdf);
    versionRouter.get('/projects/:projectId', jwt.verifyRequest, projectservice.read);
    versionRouter.put('/projects/:projectId', jwt.verifyRequest, projectservice.update);
    versionRouter.get('/projects/:projectId/users', jwt.verifyRequest, projectservice.getProjectUsers);
    versionRouter.put('/projects/:projectId/attributes', jwt.verifyRequest, projectservice.updateAttributes);
    versionRouter.delete('/projects/:projectId/attributes', jwt.verifyRequest, projectservice.deleteAttributes);
    /* Project Routes */


    /* Expenses Routes */
    versionRouter.post('/expenses/transportation-expenses', jwt.verifyRequest, fileservice.expenseCreateRequest, transportationExpenseService.create);
    versionRouter.get('/expenses/transportation-expenses/:expenseId', jwt.verifyRequest, transportationExpenseService.read);
    versionRouter.get('/expenses/transportation-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/transportation-expenses/:expenseId', jwt.verifyRequest, transportationExpenseService.update);
    versionRouter.get('/expenses/transportation-expenses/', jwt.verifyRequest, transportationExpenseService.getExpenses);
    versionRouter.post('/expenses/transportation-expenses/:expenseId/approve', jwt.verifyRequest, transportationExpenseService.approveExpense);
    versionRouter.put('/expenses/transportation-expenses/:expenseId/attributes', jwt.verifyRequest, transportationExpenseService.updateAttributes);
    versionRouter.delete('/expenses/transportation-expenses/:expenseId/attributes', jwt.verifyRequest, transportationExpenseService.deleteAttributes);

    versionRouter.post('/expenses/accomodation-expenses', jwt.verifyRequest, fileservice.expenseCreateRequest, accomodationExpenseService.create);
    versionRouter.get('/expenses/accomodation-expenses/:expenseId', jwt.verifyRequest, accomodationExpenseService.read);
    versionRouter.get('/expenses/accomodation-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/accomodation-expenses/:expenseId', jwt.verifyRequest, accomodationExpenseService.update);
    versionRouter.get('/expenses/accomodation-expenses/', jwt.verifyRequest, accomodationExpenseService.getExpenses);
    versionRouter.post('/expenses/accomodation-expenses/:expenseId/approve', jwt.verifyRequest, accomodationExpenseService.approveExpense);
    versionRouter.put('/expenses/accomodation-expenses/:expenseId/attributes', jwt.verifyRequest, accomodationExpenseService.updateAttributes);
    versionRouter.delete('/expenses/accomodation-expenses/:expenseId/attributes', jwt.verifyRequest, accomodationExpenseService.deleteAttributes);

    versionRouter.post('/expenses/food-and-beverage-expenses', jwt.verifyRequest, fileservice.expenseCreateRequest, foodAndBeverageExpenseService.create);
    versionRouter.get('/expenses/food-and-beverage-expenses/:expenseId', jwt.verifyRequest, foodAndBeverageExpenseService.read);
    versionRouter.get('/expenses/food-and-beverage-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/food-and-beverage-expenses/:expenseId', jwt.verifyRequest, foodAndBeverageExpenseService.update);
    versionRouter.get('/expenses/food-and-beverage-expenses/', jwt.verifyRequest, foodAndBeverageExpenseService.getExpenses);
    versionRouter.post('/expenses/food-and-beverage-expenses/:expenseId/approve', jwt.verifyRequest, foodAndBeverageExpenseService.approveExpense);
    versionRouter.put('/expenses/food-and-beverage-expenses/:expenseId/attributes', jwt.verifyRequest, foodAndBeverageExpenseService.updateAttributes);
    versionRouter.delete('/expenses/food-and-beverage-expenses/:expenseId/attributes', jwt.verifyRequest, foodAndBeverageExpenseService.deleteAttributes);

    versionRouter.post('/expenses/miscellaneous-expenses', jwt.verifyRequest, fileservice.expenseCreateRequest, miscellaneousExpenseService.create);
    versionRouter.get('/expenses/miscellaneous-expenses/:expenseId', jwt.verifyRequest, miscellaneousExpenseService.read);
    versionRouter.get('/expenses/miscellaneous-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/miscellaneous-expenses/:expenseId', jwt.verifyRequest, miscellaneousExpenseService.update);
    versionRouter.get('/expenses/miscellaneous-expenses/', jwt.verifyRequest, miscellaneousExpenseService.getExpenses);
    versionRouter.post('/expenses/miscellaneous-expenses/:expenseId/approve', jwt.verifyRequest, miscellaneousExpenseService.approveExpense);
    versionRouter.put('/expenses/miscellaneous-expenses/:expenseId/attributes', jwt.verifyRequest, miscellaneousExpenseService.updateAttributes);
    versionRouter.delete('/expenses/miscellaneous-expenses/:expenseId/attributes', jwt.verifyRequest, miscellaneousExpenseService.deleteAttributes);

    versionRouter.post('/expenses/purchase-gst', jwt.verifyRequest, fileservice.expenseCreateRequest, purchaseGstExpenseService.create);
    versionRouter.get('/expenses/purchase-gst/:expenseId', jwt.verifyRequest, purchaseGstExpenseService.read);
    versionRouter.get('/expenses/purchase-gst/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/purchase-gst/:expenseId', jwt.verifyRequest, purchaseGstExpenseService.update);
    versionRouter.get('/expenses/purchase-gst/', jwt.verifyRequest, purchaseGstExpenseService.getExpenses);
    versionRouter.post('/expenses/purchase-gst/:expenseId/approve', jwt.verifyRequest, purchaseGstExpenseService.approveExpense);
    versionRouter.put('/expenses/purchase-gst/:expenseId/attributes', jwt.verifyRequest, purchaseGstExpenseService.updateAttributes);
    versionRouter.delete('/expenses/purchase-gst/:expenseId/attributes', jwt.verifyRequest, purchaseGstExpenseService.deleteAttributes);

    versionRouter.post('/expenses/local-conveyance-expenses', jwt.verifyRequest, fileservice.expenseCreateRequest, localConveyanceExpenseService.create);
    versionRouter.get('/expenses/local-conveyance-expenses/:expenseId', jwt.verifyRequest, localConveyanceExpenseService.read);
    versionRouter.get('/expenses/local-conveyance-expenses/:expenseId/files/:filename', jwt.verifyRequest, fileservice.expenseReadFileRequest);
    versionRouter.put('/expenses/local-conveyance-expenses/:expenseId', jwt.verifyRequest, localConveyanceExpenseService.update);
    versionRouter.get('/expenses/local-conveyance-expenses/', jwt.verifyRequest, localConveyanceExpenseService.getExpenses);
    versionRouter.post('/expenses/local-conveyance-expenses/approve', jwt.verifyRequest, localConveyanceExpenseService.approveExpense);
    versionRouter.put('/expenses/local-conveyance-expenses/:expenseId/attributes', jwt.verifyRequest, localConveyanceExpenseService.updateAttributes);
    versionRouter.delete('/expenses/local-conveyance-expenses/:expenseId/attributes', jwt.verifyRequest, localConveyanceExpenseService.deleteAttributes);


    versionRouter.post('/requests/payments', jwt.verifyRequest, fileservice.requestPaymentCreateRequest, requestPaymentService.create);
    versionRouter.get('/requests/payments/:paymentId', jwt.verifyRequest, requestPaymentService.read);
    versionRouter.get('/requests/payments/:paymentId/files/:filename', jwt.verifyRequest, fileservice.requestPaymentReadFileRequest);
    versionRouter.put('/requests/payments/:paymentId', jwt.verifyRequest, requestPaymentService.update);
    versionRouter.get('/requests/payments/', jwt.verifyRequest, requestPaymentService.getPayments);
    versionRouter.put('/requests/payments/:paymentId/attributes', jwt.verifyRequest, requestPaymentService.updateAttributes);
    versionRouter.delete('/requests/payments/:paymentId/attributes', jwt.verifyRequest, requestPaymentService.deleteAttributes);
    /* Expenses Routes */



    return versionRouter;
}
