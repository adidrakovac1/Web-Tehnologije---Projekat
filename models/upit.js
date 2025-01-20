const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = (sequelize, DataTypes) => {
    const Upit = sequelize.define('Upit', {
      tekst: Sequelize.TEXT,
      nekretninaId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      korisnikId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }, {
        tableName: 'Upit'
    });
    Upit.associate = function(models) {
        Upit.belongsTo(models.Nekretnina, { foreignKey: 'nekretninaId' });
        Upit.belongsTo(models.Korisnik, { foreignKey: 'korisnikId' });
    };
    return Upit;
  };