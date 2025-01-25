const Sequelize = require("sequelize");
const sequelize = require("../baza.js");
    const Ponuda = sequelize.define('Ponuda', {
      tekst: Sequelize.TEXT,
      cijenaPonude: Sequelize.FLOAT,
      datumPonude: Sequelize.DATE,
      odbijenaPonuda: {
        type: Sequelize.BOOLEAN,
        defaultValue: null,
        allowNull: true
      },
      nekretninaId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      korisnikId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
     vezanePonude: {      
      type: Sequelize.INTEGER,
      allowNull: true
    }
      
    }, {
        tableName: 'Ponuda'
    });
  
  module.exports = Ponuda;