'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        hooks: {
            beforeCreate: (users) => {
                const salt = bcrypt.genSaltSync();
                users.password = bcrypt.hashSync(users.password, salt);
            }
        },
    });
    
    users.associate = function (models) {
        // associations can be defined here
    };

    users.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    }

    return users;
};