const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

    const Zahtjev = sequelize.define('Zahtjev', {
        tekst: Sequelize.TEXT,
        trazeniDatum: Sequelize.DATE,
        odobren: {
            type: Sequelize.BOOLEAN,
            defaultValue: null
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

  module.exports = Zahtjev;