const orderService = require('./order.service');

class OrderController {
    async get(req, res, next) {
        try {
            const { email } = req.user;
            const ordersData = await orderService.get(email);
            res.json(ordersData);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async create(req, res, next) {
        try {
            const { name, email } = req.user;
            const orderData = await orderService.create(name, email);
            res.json(orderData);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = new OrderController();
