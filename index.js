const express = require('express');
const session = require("express-session");
const path = require('path');
const fs = require('fs').promises; // Using asynchronus API for file read and write
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const sequelize = require('./baza.js');


const app = express();
const PORT = 3000;
const rateLimit = {};
const Korisnik = require('./models/korisnik.js');
const Nekretnine = require('./models/nekretnine.js');
const Upit = require('./models/upit.js');
const Zahtjev = require('./models/zahtjev.js');
const Ponuda = require('./models/ponuda.js');
const veze = require('./models/veze.js');

//Korisnik.sync();

//Nekretnine.sync();

//Upit.sync();

//Zahtjev.sync();

//Ponuda.sync();


sequelize.sync().then(() => {
  console.log('Database synced successfully.');
}).catch(err => {
  console.error('Error syncing database:', err);
});

app.use(session({
  secret: 'tajni_kljuc',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(__dirname + '/public'));


// Enable JSON parsing without body-parser
app.use(express.json());

/* ---------------- SERVING HTML -------------------- */

// Async function for serving html files
async function serveHTMLFile(req, res, fileName) {
  const htmlPath = path.join(__dirname, 'public/html', fileName);
  try {
    const content = await fs.readFile(htmlPath, 'utf-8');
    res.send(content);
  } catch (error) {
    console.error('Error serving HTML file:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
}

// Array of HTML files and their routes
const routes = [
  { route: '/nekretnine.html', file: 'nekretnine.html' },
  { route: '/detalji.html', file: 'detalji.html' },
  { route: '/meni.html', file: 'meni.html' },
  { route: '/prijava.html', file: 'prijava.html' },
  { route: '/profil.html', file: 'profil.html' },
  { route: '/mojiUpiti.html', file: 'mojiUpiti.html' },
  { route: '/vijesti.html', file: 'vijesti.html' },
  { route: '/statistika.html', file: 'statistika.html' }
  // Practical for adding more .html files as the project grows
];

// Loop through the array so HTML can be served
routes.forEach(({ route, file }) => {
  app.get(route, async (req, res) => {
    await serveHTMLFile(req, res, file);
  });
});

/* ----------- SERVING OTHER ROUTES --------------- */

// Async function for reading json data from data folder 
async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

// Async function for reading json data from data folder 
async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}

/*
Checks if the user exists and if the password is correct based on korisnici.json data. 
If the data is correct, the username is saved in the session and a success message is sent.
*/

async function logLoginAttempt(username, status) {
  const logFile = path.join(__dirname, 'data', 'prijave.txt');
  const logEntry = `[${new Date().toISOString()}] - username: "${username}" - status: "${status}"\n`;

  try {
    await fs.appendFile(logFile, logEntry);
  } catch (error) {
    console.error('Greška:', error);
  }
}

app.get('/trenutnoPrijavljen', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Korisnik nije prijavljen' });
    }

    const korisnik = req.session.user;
    console.log(korisnik);
    res.json(korisnik);
  } catch (error) {
    console.error("Greška pri čitanju korisnika:", error);
    res.status(500).json({ error: "Ne mogu učitati korisnika" });
  }
});

app.get('/korisnici', async (req, res) => {
  try {
    const korisnici = await Korisnik.findAll()
    res.json(korisnici.map(korisnik => korisnik.toJSON()));
  } catch (error) {
    console.error("Greška pri čitanju korisnika:", error);
    res.status(500).json({ error: "Ne mogu učitati korisnike" });
  }
});

app.post('/login', async (req, res) => {
  const jsonObj = req.body;
  console.log(jsonObj);
  const username = jsonObj.username;
  const password = jsonObj.password;
  console.log(username, password);
  const now = Date.now();

  try {
    if (rateLimit[username] && rateLimit[username].blockedUntil > now) {
      await logLoginAttempt(username, 'Neuspješno');
      return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.' });
    }

    const korisnik = await Korisnik.findOne({ where: { username: username } });
    console.log("Pronasao sam korisnika:", korisnik);
    if (!korisnik) {
      return res.status(401).json({ greska: "Neispravan username ili password" });
    }
    let found = false;
    let success = false;

    const isPasswordMatched = await bcrypt.compare(jsonObj.password, korisnik.password);
    console.log(isPasswordMatched);
    console.log(req.session);
    if (isPasswordMatched) {
      req.session.user = korisnik;
      req.session.username = korisnik.username;
      found = true;
      success = true;
      rateLimit[username] = undefined;
    }

    if (success) {
      await logLoginAttempt(username, 'Uspješno');
      return res.json({ poruka: 'Uspješna prijava' });
    }

    if (!rateLimit[username]) {
      rateLimit[username] = { attempts: 0, blockedUntil: null };
    }

    rateLimit[username].attempts++;

    if (rateLimit[username].attempts >= 3) {
      rateLimit[username].blockedUntil = now + 60000;
      await logLoginAttempt(username, 'Neuspješno');
      return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.' });
    }

    await logLoginAttempt(username, 'Neuspješno');
    res.json({ poruka: 'Neuspješna prijava' });
  } catch (error) {
    console.error('Error during login:', error);
    //await logLoginAttempt(username, 'greška');
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});
/*
Delete everything from the session.
*/
app.post('/logout', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Clear all information from the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ greska: 'Internal Server Error' });
    } else {
      res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
    }
  });
});

/*
Returns currently logged user data. First takes the username from the session and grabs other data
from the .json file.
*/
app.get('/korisnik', async (req, res) => {
  // Check if the username is present in the session
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // User is logged in, fetch additional user data
  const username = req.session.username;

  try {
    // Read user data from the JSON file
    //const users = await readJsonFile('korisnici');

    // Find the user by username
    //const user = users.find((u) => u.username === username);
    const user = await Korisnik.findOne({ where: { username: username } });

    if (!user) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Send user data
    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
      password: user.password // Should exclude the password for security reasons
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Allows logged user to make a request for a property
*/
app.post('/upit', async (req, res) => {
  console.log(req.body);
  if (!req.session.user) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { tekst, nekretninaId } = req.body;

  try {
    //const users = await readJsonFile('korisnici');

    //const nekretnine = await readJsonFile('nekretnine');

    //const loggedInUser = users.find((user) => user.username === req.session.user.username);

    //const nekretnina = nekretnine.find((property) => property.id === nekretnina_id);

    const loggedInUser = await Korisnik.findByPk(req.session.user.id);

    const nekretnina = await Nekretnine.findByPk(nekretninaId);

    console.log(nekretninaId);
    console.log(loggedInUser);
    console.log(nekretnina);
    if (!nekretnina) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }

    //const userQueries = nekretnina.upiti.filter((upit) => upit.korisnik_id === loggedInUser.id);

    const userQueries = await Upit.count({
      where: {
        korisnikId: loggedInUser.id,
        nekretninaId: nekretninaId
      }
    });

    if (userQueries >= 3) {
      return res.status(429).json({ greska: 'Previše upita za istu nekretninu.' });
    }

    /*nekretnina.upiti.push({
      korisnik_id: loggedInUser.id,
      tekst_upita: tekst_upita
    });*/
    const noviUpit = await Upit.create({
      korisnikId: loggedInUser.id,
      nekretninaId: nekretninaId,
      tekst: tekst
    });

    //await saveJsonFile('nekretnine', nekretnine);

    res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } catch (error) {
    console.error('Greška pri obradi upita:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/upiti/moji', async (req, res) => {
  console.log('Sesija prije pristupa upitima:', req.session.user);

  if (!req.session.user) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try {
    //const nekretnine = await readJsonFile('nekretnine');

    //const loggedInUser = req.session.user;

    console.log('Sesija prije pristupa upitima:', req.session.user);
    const loggedInUser = req.session.user.id;
    let upitKorisnik = await Korisnik.findOne({ where: { id: loggedInUser } });
    let upiti = await Upit.findAll({
      where: { korisnikId: upitKorisnik.id },
      include: [
        {
          model: Nekretnine,
          attributes: ['id', 'naziv', 'lokacija', 'tip_nekretnine']
        }
      ]
    });
    if (!loggedInUser) {
      return res.status(401).json({ greska: 'Korisnik nije pronađen' });
    }
    let korisnikUpiti = [];

    /*nekretnine.forEach((nekretnina) => {
      nekretnina.upiti.forEach((upit) => {
        if (upit.korisnik_id === loggedInUser.id) {
          korisnikUpiti.push({
            id: nekretnina.id,
            naziv_nekretnine: nekretnina.naziv,
            lokacija: nekretnina.lokacija,
            tip_nekretnine: nekretnina.tip_nekretnine,
            tekst_upita: upit.tekst_upita
          });
        }
      });
    });*/
    korisnikUpiti = upiti.map(upit => ({
      id: upit.Nekretnine.id,
      naziv_nekretnine: upit.Nekretnine.naziv,
      lokacija: upit.Nekretnine.lokacija,
      tip_nekretnine: upit.Nekretnine.tip_nekretnine,
      tekst_upita: upit.tekst
    }));

    if (korisnikUpiti.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(korisnikUpiti);
  } catch (error) {
    console.error('Greška pri dohvaćanju upita:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Updates any user field
*/
app.put('/korisnik', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { ime, prezime, username, password } = req.body;

  try {
    // Read user data from the JSON file
    //const users = await readJsonFile('korisnici');

    // Find the user by username
    //const loggedInUser = users.find((user) => user.username === req.session.username);
    const loggedInUser = await Korisnik.findOne({ where: { username: username } });


    if (!loggedInUser) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Update user data with the provided values
    if (ime) loggedInUser.ime = ime;
    if (prezime) loggedInUser.prezime = prezime;
    if (username) loggedInUser.username = username;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      loggedInUser.password = hashedPassword;
    }

    // Save the updated user data back to the JSON file
    //await saveJsonFile('korisnici', users);
    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Returns all properties from the file.
*/
app.get('/nekretnine', async (req, res) => {
  try {
    //const nekretnineData = await readJsonFile('nekretnine');
    const nekretnineData = await Nekretnine.findAll();

    res.json(nekretnineData);
  } catch (error) {
    console.error('Error fetching properties data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/nekretnine/top5', async (req, res) => {
  const lokacija = req.query.lokacija;

  if (!lokacija) {
    return res.status(400).json({ error: 'Lokacija je obavezna.' });
  }

  try {

    /*const nekretnine = await readJsonFile('nekretnine');

    const filtriraneNekretnine = nekretnine.filter(n => n.lokacija === lokacija);

    const top5Nekretnine = filtriraneNekretnine
        .sort((a, b) => new Date(b.datumObjave) - new Date(a.datumObjave))
        .slice(0, 5);
*/
    const top5Nekretnine = await Nekretnine.findAll({
      where: { lokacija: lokacija },
      order: [['datum_objave', 'DESC']],
      limit: 5
    });
    return res.status(200).json(top5Nekretnine);

  } catch (err) {
    console.error('Greška:', err);
    return res.status(500).json({ error: 'Greška pri čitanju ili parsiranju datoteke.' });
  }
});


app.get('/nekretnina/:id', async (req, res) => {
  const nekretninaId = parseInt(req.params.id);

  try {
    const nekretnina = await Nekretnine.findByPk(nekretninaId);

    if (!nekretnina) {
      return res.status(404).json({ error: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }

    const nekretninaDetalji = await Upit.findAll({
      where: { nekretninaId: nekretninaId },
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    res.status(200).json({
      nekretnina: {
        id: nekretnina.id,
        tip_nekretnine: nekretnina.tip_nekretnine,
        naziv: nekretnina.naziv,
        kvadratura: nekretnina.kvadratura,
        cijena: nekretnina.cijena,
        tip_grijanja: nekretnina.tip_grijanja,
        lokacija: nekretnina.lokacija,
        godina_izgradnje: nekretnina.godina_izgradnje,
        datum_objave: nekretnina.datum_objave,
        opis: nekretnina.opis
      },
      upiti: nekretninaDetalji
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju nekretnine:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});


app.get('/next/upiti/nekretnina:id', async (req, res) => {
  const nekretninaId = parseInt(req.params.id);
  const page = parseInt(req.query.page);

  if (page < 0) {
    return res.status(404).json([]);
  }

  try {
    //const nekretnine = await readJsonFile('nekretnine');

    //const nekretnina = nekretnine.find((property) => property.id === nekretninaId);

    const nekretnina = await Nekretnine.findByPk(nekretninaId);

    if (!nekretnina) {
      return res.status(404).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }

    //const sviUpiti = nekretnina.upiti.reverse(); 
    //const pageSize = 3; 
    //const startIndex = (page ) * pageSize;
    //const endIndex = startIndex + pageSize;

    //const nextUpiti = sviUpiti.slice(startIndex, endIndex); 
    const sviUpiti = await Upit.findAll({
      where: { nekretninaId: nekretninaId },
      include: {
        model: Korisnik,
        attributes: ['ime', 'prezime', 'username'],
      },
      order: [['createdAt', 'DESC']],
    });

    const pageSize = 3;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const nextUpiti = sviUpiti.slice(startIndex, endIndex);
    console.log(nextUpiti);
    if (nextUpiti.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(nextUpiti);
  } catch (error) {
    console.error('Greška pri dohvaćanju upita:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/nekretnina/:id/interesovanja', async (req, res) => {
  try {
    const nekretninaId = parseInt(req.params.id);
    const korisnik = req.session.user || null;
    console.log("korisnik je", korisnik);
    const korisnikId = korisnik ? korisnik.id : null;
    console.log("korisnik nakon sto sam trazio id je:", korisnikId);
    let korisnikIzBaze = null;
    let isAdmin = false;
    if (korisnikId) {
      korisnikIzBaze = await Korisnik.findByPk(korisnikId);
      isAdmin = korisnikIzBaze ? korisnikIzBaze.admin === true : false;
    }

    const nekretnina = await Nekretnine.findByPk(nekretninaId);
    if (!nekretnina) {
      return res.status(404).json({ error: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }
    const upiti = await Upit.findAll({ where: { nekretninaId } });
    const zahtjevi = await Zahtjev.findAll({ where: { nekretninaId } });

    let ponude = await Ponuda.findAll({ where: { nekretninaId } });

    console.log(isAdmin);
    if (!isAdmin) {
      const korisnikovePonude = korisnikId
        ? await Ponuda.findAll({ where: { korisnikId } })
        : [];
      console.log(korisnikovePonude);

      const korisnikovePonudeIds = korisnikovePonude.map(p => p.id);

      ponude = ponude.map(ponuda => {
        let vezanePonude = [];
        if (ponuda.vezanePonude) {
          try {
            vezanePonude = JSON.parse(ponuda.vezanePonude);
            if (!Array.isArray(vezanePonude)) {
              vezanePonude = [];
            }
          } catch (error) {
            console.error("Greška pri parsiranju vezanih ponuda:", error);
            vezanePonude=[];
          }
        }
        console.log(vezanePonude);

        const mozeVidjetiCijenu = korisnikId && (
          ponuda.korisnikId === korisnikId ||
          vezanePonude.some(id => korisnikovePonudeIds.includes(id))
        );

        console.log("trebao bi vidjet cijenu",mozeVidjetiCijenu);
        if (!mozeVidjetiCijenu) {
          const { cijenaPonude, ...rest } = ponuda.dataValues;
          return rest;
        }

        return ponuda;
      });
    }

    //const interesovanja = [...upiti, ...zahtjevi, ...ponude];
    //console.log(interesovanja);
    //res.status(200).json(interesovanja);

    res.status(200).json({
      upiti: upiti,
      zahtjevi: zahtjevi,
      ponude: ponude,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju interesovanja:", error);
    res.status(500).json({ error: "Greška na serveru" });
  }
});

app.post('/nekretnina/:id/ponuda', async (req, res) => {
  const nekretninaId = parseInt(req.params.id);
  let { tekst, ponudaCijene, datumPonude, idVezanePonude, odbijenaPonuda } = req.body;
  console.log(req.body);
  const korisnik = req.session.user || null;
  const korisnikId = korisnik ? korisnik.id : null;

  if (!korisnikId) {
    return res.status(401).json({ error: "Korisnik mora biti prijavljen" });
  }

  try {
    const nekretnina = await Nekretnine.findByPk(nekretninaId);
    if (!nekretnina) {
      return res.status(400).json({ message: 'Nekretnina nije pronađena.' });
    }

    let vezanaPonuda = null;
    if (idVezanePonude) {
      vezanaPonuda = await Ponuda.findByPk(idVezanePonude);
      if (!vezanaPonuda) {
        return res.status(404).json({ message: 'Vezana ponuda nije pronađena.' });
      }
      if (vezanaPonuda.odbijenaPonuda) {
        return res.status(429).json({ message: 'Vezana ponuda je odbijena, ne možete dodavati nove ponude.' });
      }

      const findRootPonuda = async (currentPonuda) => {
        while (currentPonuda.vezanaPonudaId) {
          const parentPonuda = await Ponuda.findByPk(currentPonuda.vezanaPonudaId);
          if (!parentPonuda) break;
          currentPonuda = parentPonuda;
        }
        return currentPonuda;
      };

      const getVezanePonude = async (ponudaIds, visited = new Set()) => {
        if (ponudaIds.length === 0) return [];

        ponudaIds = ponudaIds.filter(id => !visited.has(id));
        if (ponudaIds.length === 0) return [];

        visited = new Set([...visited, ...ponudaIds]);

        const vezanePonude = await Ponuda.findAll({ where: { vezanePonude: ponudaIds } });

        if (vezanePonude.length === 0) return [];

        let vezanePonudeIds = vezanePonude.map(p => p.id);
        let daljeVezane = await getVezanePonude(vezanePonudeIds, visited);

        return [...vezanePonude, ...daljeVezane];
      };

      const rootPonuda = await findRootPonuda(vezanaPonuda);
      let vezanePonudeDetalji = await getVezanePonude([rootPonuda.id]);
      vezanePonudeDetalji.unshift(rootPonuda);

      for (const ponuda of vezanePonudeDetalji) {
        if (ponuda.odbijenaPonuda) {
          return res.status(429).json({ message: 'Jedna od vezanih ponuda je odbijena, ne možete dodavati nove ponude.' });
        }
      }

      if (!vezanaPonuda.vezanePonude) {
        vezanaPonuda.vezanePonude = [];
      } else if (typeof vezanaPonuda.vezanePonude === 'string') {
        vezanaPonuda.vezanePonude = JSON.parse(vezanaPonuda.vezanePonude);
      }

      if (!vezanaPonuda.vezanePonude.includes(idVezanePonude) && idVezanePonude !== vezanaPonuda.id) {
        vezanaPonuda.vezanePonude.push(idVezanePonude);
      }

      await vezanaPonuda.save();
    }

    const ponuda = await Ponuda.create({
      tekst: tekst,
      cijenaPonude: ponudaCijene,
      datumPonude: datumPonude,
      odbijenaPonuda: odbijenaPonuda,
      nekretninaId: nekretninaId,
      korisnikId: korisnikId,
      vezanePonude: idVezanePonude || null
    });

    if (idVezanePonude) {
      await ponuda.update({
        vezanePonude: [idVezanePonude]
      });
    }

    res.status(200).json(ponuda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Došlo je do greške pri kreiranju ponude.' });
  }
});


app.get('/nekretnina/:nekretninaId/ponuda/:ponudaId', async (req, res) => {
  const nekretninaId = parseInt(req.params.nekretninaId);
  const ponudaId = parseInt(req.params.ponudaId);

  try {
      const nekretnina = await Nekretnine.findByPk(nekretninaId);
      if (!nekretnina) {
          return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
      }

      const ponuda = await Ponuda.findOne({ where: { id: ponudaId, nekretninaId } });
      if (!ponuda) {
          return res.status(404).json({ message: 'Ponuda nije pronađena ili nije vezana za ovu nekretninu.' });
      }

      const findRootPonuda = async (currentPonuda) => {
          while (currentPonuda.vezanePonude) {
              const parentPonuda = await Ponuda.findOne({ where: { id: currentPonuda.vezanePonude, nekretninaId } });
              if (!parentPonuda) break;
              currentPonuda = parentPonuda;
          }
          return currentPonuda;
      };

      const rootPonuda = await findRootPonuda(ponuda);

      const getVezanePonude = async (ponudaIds, visited = new Set()) => {
          if (ponudaIds.length === 0) return [];

          ponudaIds = ponudaIds.filter(id => !visited.has(id));
          if (ponudaIds.length === 0) return [];

          visited = new Set([...visited, ...ponudaIds]);

          const vezanePonude = await Ponuda.findAll({ where: { vezanePonude: ponudaIds, nekretninaId } });

          if (vezanePonude.length === 0) return [];

          let vezanePonudeIds = vezanePonude.map(p => p.id);
          let daljeVezane = await getVezanePonude(vezanePonudeIds, visited);

          return [...vezanePonude, ...daljeVezane];
      };

      let vezanePonudeDetalji = await getVezanePonude([rootPonuda.id]);

      vezanePonudeDetalji.unshift(rootPonuda);
      let vezanePonudeIds = vezanePonudeDetalji.map(p => p.id);

      res.status(200).json({
          roditeljPonuda: rootPonuda.id, 
          vezanePonudeIds,              
          vezanePonudeDetalji           
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Došlo je do greške pri preuzimanju ponude.' });
  }
});

app.get('/nekretnina/:nekretninaId/ponude', async (req, res) => {
  const nekretninaId = parseInt(req.params.nekretninaId);
  const korisnikId = req.query.korisnikId ? parseInt(req.query.korisnikId) : null;

  try {
    const nekretnina = await Nekretnine.findByPk(nekretninaId);
    if (!nekretnina) {
      return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    let ponude;
    if (korisnikId) {
      ponude = await Ponuda.findAll({ where: { nekretninaId, korisnikId, odbijenaPonuda:false } });
    } else {
      ponude = await Ponuda.findAll({ where: { nekretninaId } });
    }

    res.status(200).json(ponude);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Došlo je do greške pri preuzimanju ponuda.' });
  }
});

app.post('/nekretnina/:id/zahtjev', async (req, res) => {
  const nekretninaId = parseInt(req.params.id);
  const { tekst, trazeniDatum } = req.body;
  const korisnik = req.session.user || null;
  const korisnikId = korisnik ? korisnik.id : null;

  if (!korisnikId) {
    return res.status(401).json({ error: "Korisnik mora biti prijavljen" });
  }

  try {
    const nekretnina = await Nekretnine.findByPk(nekretninaId);
    if (!nekretnina) {
      return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    const trenutniDatum = new Date();
    const datumZahtjeva = new Date(trazeniDatum);
    trenutniDatum.setHours(0, 0, 0, 0);
    datumZahtjeva.setHours(0, 0, 0, 0);
    console.log(datumZahtjeva);
    console.log(trenutniDatum);

    if (isNaN(datumZahtjeva.getTime()) || datumZahtjeva < trenutniDatum) {
      return res.status(404).json({ message: 'Neispravan traženi datum. Datum mora biti u budućnosti.' });
    }

    const zahtjev = await Zahtjev.create({
      tekst,
      trazeniDatum: datumZahtjeva,
      nekretninaId,
      korisnikId
    });

    res.status(200).json(zahtjev);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Došlo je do greške pri kreiranju zahtjeva.' });
  }
});

app.put('/nekretnina/:id/zahtjev/:zid', async (req, res) => {
  const id = parseInt(req.params.id);
  const zid = parseInt(req.params.zid);
  const { odobren, addToTekst } = req.body;
  const korisnik = req.session.user || null;

  if (!korisnik || !korisnik.admin) {
    return res.status(401).json({ message: "Samo prijavljeni admin može odgovoriti na zahtjev." });
  }

  try {
    const zahtjev = await Zahtjev.findByPk(zid);
    if (!zahtjev || zahtjev.nekretninaId != id) {
      return res.status(404).json({ message: "Zahtjev nije pronađen." });
    }

    if (odobren !== true && odobren !== false) {
      return res.status(400).json({ message: "Parametar 'odobren' mora biti true ili false." });
    }

    if (odobren === false && (!addToTekst || addToTekst.trim() === "")) {
      return res.status(400).json({ message: "Morate navesti tekst odgovora pošto ste stavili da nije odobren !" });
    }

    zahtjev.odobren = odobren;
    if (odobren === false || (addToTekst && addToTekst !== "")) {
      zahtjev.tekst += ` ODGOVOR ADMINA: ${addToTekst || ''}`;
    }


    await zahtjev.save();

    res.status(200).json(zahtjev);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Došlo je do greške pri ažuriranju zahtjeva." });
  }
});


/* ----------------- MARKETING ROUTES ----------------- */

// Route that increments value of pretrage for one based on list of ids in nizNekretnina
app.post('/marketing/nekretnine', async (req, res) => {
  const { nizNekretnina } = req.body;

  try {
    // Load JSON data
    let preferencije = await readJsonFile('preferencije');

    // Check format
    if (!preferencije || !Array.isArray(preferencije)) {
      console.error('Neispravan format podataka u preferencije.json.');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Init object for search
    preferencije = preferencije.map((nekretnina) => {
      nekretnina.pretrage = nekretnina.pretrage || 0;
      return nekretnina;
    });

    // Update atribute pretraga
    nizNekretnina.forEach((id) => {
      const nekretnina = preferencije.find((item) => item.id === id);
      if (nekretnina) {
        nekretnina.pretrage += 1;
      }
    });

    // Save JSON file
    await saveJsonFile('preferencije', preferencije);

    res.status(200).json({});
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const nekretninaData = preferencije.find((item) => item.id === parseInt(id, 10));

    if (nekretninaData) {
      // Update clicks
      nekretninaData.klikovi = (nekretninaData.klikovi || 0) + 1;

      // Save JSON file
      await saveJsonFile('preferencije', preferencije);

      res.status(200).json({ success: true, message: 'Broj klikova ažuriran.' });
    } else {
      res.status(404).json({ error: 'Nekretnina nije pronađena.' });
    }
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/pretrage', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, pretrage: nekretninaData ? nekretninaData.pretrage : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/klikovi', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, klikovi: nekretninaData ? nekretninaData.klikovi : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
