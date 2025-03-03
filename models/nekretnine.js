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
    Nekretnine.getInteresovanja = async function(nekretninaId) {
        return await sequelize.models.Upit.findAll({
          where: { nekretninaId },
          include: [
            { model: sequelize.models.Zahtjev, where: { nekretninaId }, required: false },
            { model: sequelize.models.Ponuda, where: { nekretninaId }, required: false },
          ]
        });
    };
module.exports = Nekretnine;
