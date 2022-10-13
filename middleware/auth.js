const AuthError = require('../routes/auth/exeption/auth.error');
const tokenService = require('../routes/auth/token.service');
const User = require('../models/user');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(AuthError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(AuthError.UnauthorizedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(AuthError.UnauthorizedError());
        }

        const user = await User.findOne({ email: userData.email });

        if (!user.isActivated) {
            return next(AuthError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(AuthError.UnauthorizedError());
    }
};
