const coursesService = require('./curses.service');
const { validationResult } = require('express-validator');

class CoursesController {
    async getAll(req, res, next) {
        try {
            const allCourses = await coursesService.getAll();
            return res.json(allCourses);
        } catch (e) {
            console.log(e);
            return res.json(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const course = await coursesService.getOne(id);
            return res.json(course);
        } catch (e) {
            console.log(e);
            return res.json(e);
        }
    }

    async add(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array());
            }
            const { title, price, img } = req.body;
            const { email, name } = req.user;
            const course = await coursesService.add(
                title,
                price,
                img,
                email,
                name
            );
            res.json(course);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async edit(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array());
            }
            const { id, title, price, img } = req.body;
            const course = await coursesService.edit(id, { title, price, img });
            res.json(course);
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
            const coursesData = await coursesService.delete(id);
            res.json(coursesData);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = new CoursesController();
