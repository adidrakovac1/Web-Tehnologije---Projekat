const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

  const Upit = sequelize.define("Upit", {
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
    tableName: "Upit"
});

module.exports = Upit;