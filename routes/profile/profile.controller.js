const profileService = require('./profile.service');

class ProfileController {
    async getProfile(req, res, next) {
        try {
            const { email } = req.user;
            const userData = await profileService.getProfile(email);
            res.json(userData);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async editProfile(req, res, next) {
        try {
            const { email } = req.user;
            const { newEmail, newName } = req.body;
            const userData = await profileService.editProfile(
                newName,
                newEmail,
                email
            );
            res.json(userData);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = new ProfileController();
