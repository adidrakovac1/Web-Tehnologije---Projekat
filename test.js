const db = require("./baza.js");

if (!db.sequelize) {
    console.error("Greška: Sequelize nije učitan iz baza.js!");
    process.exit(1);
}

const podaci = async () => {
    try {
        await db.sequelize.sync({ force: true });
        console.log("Baza je resetovana.");
        
        await db.Korisnik.create({ ime: "Neko", prezime: "Nekic", username: "username1", password: "hashovana_lozinka" });
        console.log("Dodani korisnici.");

    } catch (error) {
        console.error("Greška pri unosu podataka:", error);
    } finally {
        process.exit();
    }
};

podaci();
