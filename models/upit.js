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
Upit.associate = function(models) {
  Upit.belongsTo(models.Nekretnine, { foreignKey: 'nekretninaId' });
  Upit.belongsTo(models.Korisnik, { foreignKey: 'korisnikId' });
};

module.exports = Upit;