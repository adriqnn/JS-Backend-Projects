const {verifyToken} = require('../services/userService')

module.exports = () => (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        try{
            //TODO add if needed additional info
            const userData = verifyToken(token);
            req.user = userData;
            res.locals.username = userData.username;
        }catch(err){
            res.clearCookie('token');
            res.redirect('/auth/login');
            return;
        };
    };
    next();
};