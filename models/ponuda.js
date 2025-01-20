const Sequelize = require("sequelize");
const sequelize = require("../baza.js");
module.exports = (sequelize, DataTypes) => {
    const Ponuda = sequelize.define('Ponuda', {
      tekst: Sequelize.TEXT,
      cijenaPonude: Sequelize.FLOAT,
      datumPonude: Sequelize.DATE,
      odbijenaPonuda: Sequelize.BOOLEAN,
      nekretninaId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      korisnikId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vezanePonude: Sequelize.JSON
      
    }, {
        tableName: 'Ponuda'
    });
  
    Ponuda.associate = function(models) {
        Ponuda.belongsTo(models.Nekretnina, { foreignKey: 'nekretninaId' });
        Ponuda.belongsTo(models.Korisnik, { foreignKey: 'korisnikId' });
        Ponuda.hasMany(models.Ponuda, { as: 'vezanePonude', foreignKey: 'ponudaId' });
    };
    return Ponuda;
  };