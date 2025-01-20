const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = (sequelize, DataTypes) => {
    const Korisnik = sequelize.define('Korisnik', {
      ime: Sequelize.STRING,
      prezime: Sequelize.STRING,
      password: Sequelize.STRING,
      username: Sequelize.STRING,
      admin: {
        type:Sequelize.BOOLEAN,
        defaultValue: false
      }
    }, {
        tableName:'Korisnik'
    });
    Korisnik.associate = function(models) {
      Korisnik.hasMany(models.Upit, { foreignKey: 'korisnikId' });
      Korisnik.hasMany(models.Zahtjev, { foreignKey: 'korisnikId' });
      Korisnik.hasMany(models.Ponuda, { foreignKey: 'korisnikId' });
    };
    return Korisnik;
  };