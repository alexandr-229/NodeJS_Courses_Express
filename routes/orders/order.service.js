const Order = require('../../models/order');
const User = require('../../models/user');
const Course = require('../../models/course');

class OrderService {
    async get(email) {
        try {
            if (!email) {
                throw new Error('Invalid Body');
            }
            const orders = await Order.find({ email });

            const price = orders.reduce((total, c) => {
                const oneOrderPrice = c.courses.reduce((total, course) => {
                    return (total += course.course.price * course.count);
                }, 0);
                return (total += oneOrderPrice);
            }, 0);

            return { orders, price };
        } catch (e) {
            throw new Error(e);
        }
    }

    async create(name, email) {
        try {
            if (!name || !email) {
                throw new Error('Invalid Body');
            }
            const user = await User.findOne({ email });
            let courses = [];
            for (course of user.cart.items) {
                courses.push({
                    course: await Course.findById(course.courseId),
                    count: course.count,
                });
            }

            if (courses.length < 1) {
                throw new Error('Impossible to order');
            }

            const order = new Order({
                user: {
                    name,
                    email,
                },
                courses,
            });

            user.cart = { items: [] };

            await order.save();
            await user.save();

            return this.get(email);
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new OrderService();
