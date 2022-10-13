const { config } = require('dotenv');
const User = require('../../models/user');
const mailService = require('./mail.service');
const tokenService = require('../auth/token.service');
const UserDto = require('../auth/dto/user.dto');

class ProfileService {
    async getProfile(email) {
        try {
            if (!email) {
                throw new Error('Invalid Body');
            }
            const user = await User.findOne({ email });
            const { name, avatar } = user;
            return { name, avatar: avatar ? avatar : 'No avatar yet' };
        } catch (e) {
            throw new Error(e);
        }
    }

    async editProfile(newName, newEmail, email) {
        try {
            if (!newName || !newEmail || !email) {
                throw new Error('Invalid Body');
            }
            const user = await User.findOne({ email });
            user.name = newName;
            if (newEmail !== email) {
                const candidate = await User.findOne({ email: newEmail });
                if (candidate) {
                    throw new Error(
                        `User with email ${newEmail} already exists`
                    );
                }

                user.email = newEmail;
                user.isActivated = false;

                const userDto = new UserDto(user);
                const tokens = tokenService.generateTokens({ ...userDto });
                await tokenService.saveToken(userDto.id, tokens.refreshToken);

                await mailService.sendActivationMail(
                    newEmail,
                    `${config().parsed.LINK}/auth/activate/${
                        user.activationLink
                    }`,
                    newName
                );

                return {
                    user,
                    tokens,
                };
            }
            await user.save();
            return user;
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new ProfileService();
