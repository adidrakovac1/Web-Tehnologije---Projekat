const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = (sequelize, DataTypes) => {
    const Zahtjev = sequelize.define('Zahtjev', {
        upit: Sequelize.TEXT,
        trazeniDatum: Sequelize.DATE,
        odobren: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        nekretninaId:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        korisnikId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Zahtjev'
    });
    Zahtjev.associate = function(models) {
        Zahtjev.belongsTo(models.Nekretnina, { foreignKey: 'nekretninaId' });
        Zahtjev.belongsTo(models.Korisnik, { foreignKey: 'korisnikId' });
    };
    return Zahtjev;
  };