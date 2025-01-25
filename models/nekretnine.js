const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

    const Nekretnine = sequelize.define('Nekretnine', {
        tip_nekretnine: Sequelize.STRING,
        naziv: Sequelize.STRING,
        kvadratura: Sequelize.INTEGER,
        cijena: Sequelize.INTEGER,
        tip_grijanja: Sequelize.STRING,
        lokacija: Sequelize.STRING,
        godina_izgradnje: Sequelize.INTEGER,
        datum_objave: Sequelize.DATE,
        opis: Sequelize.TEXT,
    }, {
        tableName:'Nekretnine'
    });

module.exports = Nekretnine;
