const User = require('../../models/user');
const Course = require('../../models/course');

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return (total += course.course.price * course.count);
    }, 0);
}

class CardService {
    async getAll(email) {
        try {
            if (!email) {
                throw new Error('Invalid Body');
            }
            const user = await User.findOne({ email });
            let courses = [];
            for (let i = 0; i < user.cart.items.length; i++) {
                courses.push({
                    course: await Course.findById(user.cart.items[i].courseId),
                    count: user.cart.items[i].count,
                });
            }
            return { price: computePrice(courses), courses };
        } catch (e) {
            throw new Error(e);
        }
    }

    async add(id, email) {
        try {
            if (!id || !email) {
                throw new Error('Invalid Body');
            }
            const course = await Course.findById(id);
            const user = await User.findOne({ email });
            const items = [...user.cart.items];
            const index = items.findIndex((c) => {
                return c.courseId.toString() === course._id.toString();
            });

            if (index >= 0) {
                items[index].count = items[index].count + 1;
            } else {
                items.push({
                    courseId: course._id,
                    count: 1,
                });
            }

            user.cart = { items };
            return user.save();
        } catch (e) {
            throw new Error(e);
        }
    }

    async delete(id, email) {
        try {
            const user = await User.findOne({ email });
            let items = [...user.cart.items];
            const index = items.findIndex(
                (c) => c.courseId.toString() === id.toString()
            );

            if (items[index].count === 1) {
                items = items.filter(
                    (c) => c.courseId.toString() !== id.toString()
                );
            } else {
                items[index].count--;
            }

            user.cart = { items };
            await user.save();
            let courses = [];
            for (let i = 0; i < user.cart.items.length; i++) {
                courses.push({
                    course: await Course.findById(user.cart.items[i].courseId),
                    count: user.cart.items[i].count,
                });
            }
            return { price: computePrice(courses), courses };
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new CardService();
