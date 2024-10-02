const { DataTypes } = require("sequelize");
const database = require("../db/db");

const user = database.db.define(
    "db_role",
    {
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone_no: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

user.sync();
module.exports = user;
