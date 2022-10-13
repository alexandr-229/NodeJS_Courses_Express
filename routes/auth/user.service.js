const User = require('../../models/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail.service');
const tokenService = require('./token.service');
const UserDto = require('./dto/user.dto');
const AuthError = require('./exeption/auth.error');
const { config } = require('dotenv');

class UserService {
    async registration(email, name, password) {
        const candidate = await User.findOne({ email });
        if (candidate) {
            throw AuthError.BadRequest(
                `User with email ${email} already exists`
            );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await User.create({
            email,
            name,
            password: hashPassword,
            activationLink,
        });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.isActivated, tokens.refreshToken);

        await mailService.sendActivationMail(
            email,
            `${config().parsed.LINK}/auth/activate/${activationLink}`,
            name
        );

        return {
            ...tokens,
            user: userDto,
        };
    }

    async activate(activationLink) {
        const user = await User.findOne({ activationLink });
        if (!user) {
            throw AuthError.BadRequest('User with this link not found');
        }
        user.isActivated = true;
        await user.save();
        console.log(user._doc);
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw AuthError.BadRequest('User not found');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw AuthError.BadRequest('Error password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.is, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw AuthError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw AuthError.UnauthorizedError();
        }
        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.is, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async sendMessageRestore(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthError.BadRequest('User not found');
            }
            await mailService.sendMessageToRestorePassword(
                email,
                user.name,
                `${config().parsed.LINK}/auth/restore/${user.activationLink}`
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async restore(newPassword, activationLink) {
        try {
            const user = await User.findOne({ activationLink });
            if (!user) {
                throw AuthError.BadRequest('User not found');
            }
            const hashPassword = await bcrypt.hash(newPassword, 3);
            user.password = hashPassword;
            await user.save();

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.is, tokens.refreshToken);

            await mailService.sendMessagePasswordChanged(user.email);
            const { password, _id, ...restUser } = user._doc;
            return { user: restUser, tokens };
        } catch (e) {
            return false;
        }
    }

    async getProfile() {
        try {
        } catch (e) {
            throw new Error(e);
        }
    }

    async editProfile(email, name, file = null) {
        try {
        } catch (e) {
            res.json(e);
        }
    }
}

module.exports = new UserService();
