const cardService = require('./card.service');
const { validationResult } = require('express-validator');

class CardController {
    async getAll(req, res, next) {
        try {
            const { email } = req.user;
            const card = await cardService.getAll(email);
            res.json(card);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async add(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array());
            }
            const { id } = req.body;
            const { email } = req.user;
            const card = await cardService.add(id, email);
            res.json(card);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async delete(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array());
            }
            const { id } = req.body;
            const { email } = req.user;
            const card = await cardService.delete(id, email);
            res.json(card);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = new CardController();
