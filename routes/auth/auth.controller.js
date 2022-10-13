const { validationResult } = require('express-validator');
const userService = require('./user.service');
const AuthError = require('./exeption/auth.error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(AuthError.BadRequest('Error', errors.array()));
            }
            const { email, name, password } = req.body;
            const userData = await userService.registration(
                email,
                name,
                password
            );
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async sendMessageRestore(req, res, next) {
        try {
            const { email } = req.body;
            const userData = await userService.sendMessageRestore(email);

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async restorePassword(req, res, next) {
        try {
            const { password, activationLink } = req.body;
            const userData = await userService.restore(
                password,
                activationLink
            );

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUserData(req, res, next) {
        const { email, name, isActivated } = req.user;
        res.json({ email, name, isActivated });
    }
}

module.exports = new UserController();
