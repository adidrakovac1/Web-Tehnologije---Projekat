const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}

async function dodajKorisnika(filename, noviKorisnik) {
  try {
    const korisnici = await readJsonFile(filename);

    const postoji = korisnici.some(k => k.username === noviKorisnik.username);
    if (postoji) {
      console.log('Korisnik sa ovim username-om već postoji.');
      return;
    }

    noviKorisnik.password = await bcrypt.hash(noviKorisnik.password, 10);

    korisnici.push(noviKorisnik);

    await saveJsonFile(filename, korisnici);

    console.log('Novi korisnik uspešno dodat.');
  } catch (error) {
    console.error('Greška prilikom dodavanja korisnika:', error);
  }
}

dodajKorisnika('korisnici', {
  id: 4,
  ime: 'NekoNeko',
  prezime: 'NekicNekic',
  username: 'username5',
  password: '123123' 
});
