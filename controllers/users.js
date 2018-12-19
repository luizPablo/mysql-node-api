const users = require('../models').users;
const jwt = require('jsonwebtoken');
require('dotenv-safe').load();

module.exports = {
    async login(req, res) {
        const user = await users.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            if (user.validPassword(req.body.password)) {
                const id = user.id;
                var token = jwt.sign({
                    id
                }, process.env.SECRET, {
                    expiresIn: 300
                });
                return res.json({
                    auth: true,
                    token: token
                });
            } else {
                return res.json({
                    auth: false,
                    message: 'Invalid password'
                });
            }
        }

        return res.json({
            auth: false,
            message: 'User not found'
        });
    },

    async store(req, res) {
        const user = await users.create(req.body);

        return res.json(user);
    },

    async index(req, res) {
        const {
            page = 1
        } = req.query;
        const all_users = await users.findAndCountAll({
            offset: (page - 1) * 10,
            limit: 10
        });

        return res.json({
            "data": all_users.rows,
            "total": all_users.count,
            "pages": Math.ceil(all_users.count / 2),
            "page": parseInt(page)
        });
    },

    async show(req, res) {
        const user = await users.findById(req.params.id);

        return res.json(user);
    },

    async update(req, res) {
        const user = await users.findById(req.params.id);
        await user.update(req.body);

        return res.json(user);
    },

    async destroy(req, res) {
        const user = await users.findById(req.params.id);
        await user.destroy();

        return res.json(user);
    }
}