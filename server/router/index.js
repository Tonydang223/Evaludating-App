

const auth = require('./auth')
const post = require('./post')
const category = require('./category')
const user = require('./user')
function pathRoute(app){
    app.use('/api/auth',auth);
    app.use('/api/action',post);
    app.use('/api/category',category);
    app.use('/api/user',user);
}

module.exports = pathRoute
