const Course = require('../../models/course');

class CoursesService {
    async getAll() {
        try {
            return await Course.find();
        } catch (e) {
            return e;
        }
    }

    async getOne(id) {
        try {
            return await Course.findById(id);
        } catch (e) {}
    }

    async add(title, price, img, email, name) {
        try {
            if (!title || !price || !img || !email || !name) {
                throw new Error('Invalid Body');
            }
            const course = await Course.create({
                title,
                price,
                img,
                authorName: name,
                authorEmail: email,
            });
            return course;
        } catch (e) {
            console.log(e);
            throw new Error(e.message);
        }
    }

    async edit(id, body) {
        try {
            if (!id || !body.title || !body.price || !body.img) {
                throw new Error('Invalid Body');
            }
            await Course.findByIdAndUpdate(id, body, {
                new: false,
            });
            const course = await Course.findById(id);
            return course;
        } catch (e) {
            throw new Error(e);
        }
    }

    async delete(id) {
        try {
            if (!id) {
                throw new Error('Invalid Body');
            }
            const coursesData = await Course.findByIdAndDelete(id);
            return coursesData;
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new CoursesService();
