const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = (sequelize, DataTypes) => {
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
    Nekretnine.associate = function(models) {
        Nekretnine.hasMany(models.Upit, { foreignKey: 'nekretninaId' });
        Nekretnine.hasMany(models.Zahtjev, { foreignKey: 'nekretninaId' });
        Nekretnine.hasMany(models.Ponuda, { foreignKey: 'nekretninaId' });
      };
    Nekretnine.getInteresovanja = async function(nekretninaId) {
        return await sequelize.models.Upit.findAll({
          where: { nekretninaId },
          include: [
            { model: sequelize.models.Zahtjev, where: { nekretninaId }, required: false },
            { model: sequelize.models.Ponuda, where: { nekretninaId }, required: false },
          ]
        });
    };
    return Nekretnine;
};