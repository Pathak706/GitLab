let authservice = require('./../services/authservice').router;
let userservice = require('./../services/userservice').router;
let projectservice = require('./../services/projectservice').router;
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

    /* User Routes */
    versionRouter.post('/projects', jwt.verifyRequest, projectservice.create);
    versionRouter.get('/projects', jwt.verifyRequest, projectservice.getProjects);
    versionRouter.get('/projects/:projectId', jwt.verifyRequest, projectservice.read);
    versionRouter.put('/projects/:projectId', jwt.verifyRequest, projectservice.update);
    //versionRouter.delete('/users/:userId', userservice.delete);
    /* User Routes */


    return versionRouter;
}
