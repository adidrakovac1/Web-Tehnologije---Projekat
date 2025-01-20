const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24", "root", "password", {
  host: "localhost",
  dialect: "mysql"
});
module.exports = sequelize;

/*const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import modela
db.korisnik = sequelize.import(__dirname + '/korisnik.js');
db.nekretnine = sequelize.import(__dirname + '/nekretnina.js');
db.ponuda = sequelize.import(__dirname + '/ponuda.js');
db.zahtjev = sequelize.import(__dirname + '/zahtjev.js');
db.upit = sequelize.import(__dirname + '/upit.js');

// Relacije
db.korisnik.hasMany(db.upit, { foreignKey: 'korisnikId' });
db.upit.belongsTo(db.korisnik, { foreignKey: 'korisnikId' });

db.korisnik.hasMany(db.zahtjev, { foreignKey: 'korisnikId' });
db.zahtjev.belongsTo(db.korisnik, { foreignKey: 'korisnikId' });

db.korisnik.hasMany(db.ponuda, { foreignKey: 'korisnikId' });
db.ponuda.belongsTo(db.korisnik, { foreignKey: 'korisnikId' });

db.nekretnine.hasMany(db.ponuda, { foreignKey: 'nekretninaId' });
db.ponuda.belongsTo(db.nekretnine, { foreignKey: 'nekretninaId' });

db.nekretnine.hasMany(db.upit, { foreignKey: 'nekretninaId' });
db.upit.belongsTo(db.nekretnine, { foreignKey: 'nekretninaId' });

db.nekretnina.hasMany(db.zahtjev, { foreignKey: 'nekretninaId' });
db.zathjev.belongsTo(db.nekretnine, { foreignKey: 'nekretninaId' });

Nekretnine.getInteresovanja = async function(nekretninaId) {
    return await sequelize.models.Upit.findAll({
      where: { nekretninaId },
      include: [
        { model: sequelize.models.Zahtjev, where: { nekretninaId }, required: false },
        { model: sequelize.models.Ponuda, where: { nekretninaId }, required: false },
      ]
    });
}
db.ponuda.prototype.vezanePonude = async function() {
  return await this.getPonudas({ as: 'vezanePonude' });
};

module.exports = db;*/