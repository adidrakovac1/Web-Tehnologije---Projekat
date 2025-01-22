const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

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
  
  sequelize.sync().then(() => {
    Korisnik.count().then(count => {
      if (count === 0) {
        Korisnik.create({
          ime: 'admin',
          prezime: 'admin',
          username: 'admin',
          password: '$2a$12$Yrcxqr6xy/9Ej6qpADXrBeC2MXtTOGKuPiALpJfkhbD6cmKdZvvby',
          admin: true
        });
  
        Korisnik.create({
          ime: 'korisnik',
          prezime: 'korisnik',
          username: 'korisnik',
          password: '$2a$12$gWB5jkqIecskCCb01.xue.dYHEufSmSHfJ//GzM9z9WESD2cyAB4i',
          admin: false
        });
      }
    });
  });
 module.exports = Korisnik;