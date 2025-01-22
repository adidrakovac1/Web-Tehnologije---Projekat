const Korisnik = require('./korisnik.js');
const Nekretnine = require('./nekretnine.js');
const Upit=require('./upit.js');
const Zahtjev= require('./zahtjev.js');
const Ponuda=require('./ponuda.js');

Upit.belongsTo(Nekretnine, { foreignKey: 'nekretninaId' });
Upit.belongsTo(Korisnik, { foreignKey: 'korisnikId' });

Zahtjev.belongsTo(Nekretnine, { foreignKey: 'nekretninaId' });
Zahtjev.belongsTo(Korisnik, { foreignKey: 'korisnikId' });

Nekretnine.hasMany(Upit, { foreignKey: 'nekretninaId' });
Nekretnine.hasMany(Zahtjev, { foreignKey: 'nekretninaId' });
Nekretnine.hasMany(Ponuda, { foreignKey: 'nekretninaId' });

Ponuda.belongsTo(Nekretnine, { foreignKey: 'nekretninaId' });
Ponuda.belongsTo(Korisnik, { foreignKey: 'korisnikId' });
