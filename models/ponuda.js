const Sequelize = require("sequelize");
const sequelize = require("../baza.js");
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
     vezanePonude: {      
      type: Sequelize.INTEGER
    }
      
    }, {
        tableName: 'Ponuda'
    });
  
    Ponuda.associate = function(models) {
        Ponuda.belongsTo(models.Nekretnine, { foreignKey: 'nekretninaId' });
        Ponuda.belongsTo(models.Korisnik, { foreignKey: 'korisnikId' });
    };
  module.exports = Ponuda;