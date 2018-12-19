require('dotenv-safe').load();

const express = require('express');
const users = require('../controllers/users');
const jwt = require('jsonwebtoken');
const routes = express.Router();

function authenticated(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({
            auth: false,
            message: 'No token provided'
        });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        req.user_id = decoded.id;
        next();
    });
}

routes.post('/login', users.login);
routes.post('/users', authenticated, users.store);
routes.get('/users', authenticated, users.index);
routes.get('/users/:id', authenticated, users.show);
routes.put('/users/:id', authenticated, users.update);
routes.delete('/users/:id', authenticated, users.destroy);

module.exports = routes;