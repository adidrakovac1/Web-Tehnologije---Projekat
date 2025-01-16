let trenutnaStranica = 1;
let trenutnoUcitaniUpiti = [];
let trenutniIndex = 1;
let imaVišeUpita = true;
const urlParams = new URLSearchParams(window.location.search);
const idNekretnine = urlParams.get("idNekretnine");

document.addEventListener("DOMContentLoaded", () => {

    console.log("ID nekretnine:", idNekretnine);

    if (!idNekretnine) {
        alert("Nije pronađen ID nekretnine.");
    }

    PoziviAjax.getNekretnina(idNekretnine, (error, data) => {
        console.log("Data from getNekretnina:", data);

        if (error) {
            alert(error);
        } else {
            if (data.status === 200) {
                ispisiOsnovnoIDetalje(data.message);
                ispisiUpiteCarousel(data.message.upiti);
            } else {
                alert("Greška: " + data.message.greska);
            }
        }
    });
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('lokacija-link')) {
            const top5Element = document.getElementById("top5-nekretnine");
            const top5Text = document.getElementById("top5");


            event.preventDefault();
            const lokacija = event.target.getAttribute('data-lokacija');
            console.log('Lokacija:', lokacija);

            top5Element.style.display = "flex";
            top5Text.style.display = "block";


            PoziviAjax.getTop5Nekretnina(lokacija, (error, data) => {
                if (error) {
                    console.error('Greška:', error);
                } else {
                    console.log('Podaci:', data);
                    ispisiTop5Nekretnina(data);
                }
            });
        }
    });
});

async function ispisiOsnovnoIDetalje(podaci) {
    const osnovnoElement = document.getElementById("osnovno");
    const detaljiElement = document.getElementById("detalji");

    osnovnoElement.innerHTML = `
        <img src="../Resources/${podaci.id}.jpg" alt="${podaci.naziv}">
        <p><strong>Naziv:</strong> ${podaci.naziv}</p>
        <p><strong>Kvadratura:</strong> ${podaci.kvadratura} m²</p>
        <p><strong>Cijena:</strong> ${podaci.cijena} KM</p>
    `;

    const link = `../HTML/nekretnine.html?lokacija=${podaci.lokacija}`;
    detaljiElement.innerHTML = `
        <div id="kolona1">
            <p><strong>Tip grijanja:</strong> ${podaci.tip_grijanja}</p>
            <p><strong>Lokacija:</strong> <a href="${link}" class="lokacija-link" data-lokacija="${podaci.lokacija}">${podaci.lokacija}</a></p>
        </div>
        <div id="kolona2">
            <p><strong>Godina izgradnje:</strong> ${podaci.godina_izgradnje}</p>
            <p><strong>Datum objave oglasa:</strong> ${podaci.datum_objave}</p>
        </div>
        <div id="opis">
            <p><strong>Opis:</strong> ${podaci.opis}</p>
        </div>
    `;
}

async function ispisiUpiteCarousel(upiti) {
    const upitElement = document.getElementById("carousel-upit");
    const korisnici = await fetch('/korisnici').then(response => response.json());
    const korisnikMap = {};
    korisnici.forEach(korisnik => {
        korisnikMap[korisnik.id] = korisnik.username;
    });

    trenutnoUcitaniUpiti = [...upiti];
    console.log("Početni upiti:", trenutnoUcitaniUpiti);

    if (upiti.length < 3) {
        imaVišeUpita = false;
    }

    upitElement.innerHTML = '';

    const container = document.createElement("div");
    container.classList.add("carousel-container");
    upitElement.appendChild(container);

    for (let upit of trenutnoUcitaniUpiti) {
        const korisnikIme = korisnikMap[upit.korisnik_id] || "undefined";

        const upitDiv = document.createElement("div");
        upitDiv.classList.add("carousel-item");
        upitDiv.innerHTML = `
            <div class="upit">
                <p><strong>Korisnik:</strong> ${korisnikIme}</p>
                <p><strong>Tekst upita:</strong> ${upit.tekst_upita}</p>
            </div>
        `;
        container.appendChild(upitDiv);
    }

    let sviElementi = [...container.getElementsByClassName("carousel-item")];
    console.log("Elementi carousel-a:", sviElementi);

    if (sviElementi.length === 0) {
        container.innerHTML = "<p>Za ovu nekretninu nema upita.</p>";
        return;
    }

    trenutniIndex = 0;
    prikaziTrenutniUpit(sviElementi, trenutniIndex);

    const btnLijevo = document.getElementById("prev");
    const btnDesno = document.getElementById("next");

    console.log("trenutna stranica", trenutnaStranica);

    btnLijevo.addEventListener("click", () => {
        console.log("Trenutni index:", trenutniIndex);
        console.log("Ukupno elemenata:", sviElementi.length);
        console.log("Ima više upita:", imaVišeUpita);

        if (trenutniIndex > 0) {
            trenutniIndex--;
            prikaziTrenutniUpit(sviElementi, trenutniIndex);
        } else {
            console.log("Već ste na prvom upitu.");
            trenutniIndex = sviElementi.length - 1;
            prikaziTrenutniUpit(sviElementi, trenutniIndex);
        }
    });

    btnDesno.addEventListener("click", () => {
        console.log("Index prije:", trenutniIndex);

        if (trenutniIndex < sviElementi.length -1) {
            trenutniIndex++;
            console.log("Trenutni novi index:", trenutniIndex);
            console.log("Ukupno elemenata:", sviElementi.length);
            console.log("Ima više upita:", imaVišeUpita);
            prikaziTrenutniUpit(sviElementi, trenutniIndex);
        } else if (imaVišeUpita) {
            console.log("Učitavanje novih upita za stranicu:", trenutnaStranica);
            if (!idNekretnine || trenutnaStranica < 0) {
                console.error("Greška: idNekretnine ili trenutnaStranica nisu ispravni.");
                return;
            }
            PoziviAjax.getNextUpiti(idNekretnine, trenutnaStranica, (error, data) => {
                if (error) {
                    console.error("Greška pri dohvaćanju upita:", error);
                    trenutniIndex=0;
                    prikaziTrenutniUpit(sviElementi,trenutniIndex);
                    return;
                }

                console.log("Data from getNextUpiti:", data);

                if (data.status === 200) {
                    if (data.message.length === 0) {
                        console.log("Nema više upita.");
                        imaVišeUpita = false;
                        trenutniIndex = 0;
                        return;
                    }

                    let noviUpiti = data.message.filter(upit =>
                        !trenutnoUcitaniUpiti.some(existing =>
                            existing.korisnik_id === upit.korisnik_id && existing.tekst_upita === upit.tekst_upita
                        )
                    ).slice(0,3);

                    console.log("Novi upiti nakon filtra:", noviUpiti);

                    console.log("Trenutno učitani upiti:", trenutnoUcitaniUpiti);
                    console.log("Novi upiti s API-ja:", data.message);

                    if (noviUpiti.length > 0) {
                        trenutnaStranica++;
                        console.log("stranica",trenutnaStranica);
                        trenutnoUcitaniUpiti = [...trenutnoUcitaniUpiti, ...noviUpiti];
                        console.log("Novi upiti nakon učitavanja:", trenutnoUcitaniUpiti);

                        for (let upit of noviUpiti) {
                            const korisnikIme = korisnikMap[upit.korisnik_id] || "undefined";
                            const upitDiv = document.createElement("div");
                            upitDiv.classList.add("carousel-item");
                            upitDiv.innerHTML = `
                                            <div class="upit">
                                                <p><strong>Korisnik:</strong> ${korisnikIme}</p>
                                                <p><strong>Tekst upita:</strong> ${upit.tekst_upita}</p>
                                            </div>
                                        `;
                            container.appendChild(upitDiv);
                        }

                        console.log("testing 123");
                        if (data.message.length < 3) {
                            imaVišeUpita = false;
                        }

                        sviElementi = [...container.getElementsByClassName("carousel-item")];
                        console.log("Ažurirani elementi carousel-a:", sviElementi);

                        trenutniIndex = sviElementi.length - noviUpiti.length;

                        prikaziTrenutniUpit(sviElementi, trenutniIndex);
                    } else {
                        console.log("Nema novih upita za dodavanje.");
                        imaVišeUpita = false;
                        trenutniIndex = sviElementi.length - 1;
                    }
                } else {
                    console.log("Greška u odgovoru API-ja:", data.message);
                }
            });
        } else {
            console.log("Trenutni index:", trenutniIndex);
            console.log("Ukupno elemenata:", sviElementi.length);
            trenutniIndex=0;
            prikaziTrenutniUpit(sviElementi, trenutniIndex);
        }
    });

    function prikaziTrenutniUpit(sviElementi, trenutniIndex) {
        sviElementi.forEach((element, index) => {
            element.style.display = index === trenutniIndex ? 'block' : 'none';
        });
    }
}

async function ispisiTop5Nekretnina(nekretnine) {
    console.log(nekretnine);
    const top5Element = document.getElementById("top5-nekretnine");
    const top5 = document.getElementById("top5");


     top5.innerHTML = 'Najnovije nekretnine na istoj lokaciji:<br>';

    if (nekretnine.length === 0) {
        html += '<p>Nema dostupnih nekretnina na ovoj lokaciji.</p>';
    } else {
        nekretnine.forEach((nekretnina, index) => {
            const poddiv = document.createElement("div");
            poddiv.classList.add("nekretnina");

            poddiv.innerHTML = `
                <img src="../Resources/${nekretnina.id}.jpg" alt="${nekretnina.naziv}">
                <p><strong>Naziv:</strong> ${nekretnina.naziv}</p>
                <p><strong>Kvadratura:</strong> ${nekretnina.kvadratura} m²</p>
                <p><strong>Cijena:</strong> ${nekretnina.cijena} KM</p>
                <p><strong>Tip grijanja:</strong> ${nekretnina.tip_grijanja}</p>
                <p><strong>Lokacija:</strong> ${nekretnina.lokacija}</a></p>
                <p><strong>Godina izgradnje:</strong> ${nekretnina.godina_izgradnje}</p>
                <p><strong>Datum objave oglasa:</strong> ${nekretnina.datum_objave}</p>
                <p><strong>Opis:</strong> ${nekretnina.opis}</p>
            `;
            const detaljiDugme = document.createElement('a');
            detaljiDugme.href = `../detalji.html?idNekretnine=${nekretnina.id}`;
            detaljiDugme.classList.add('detalji-dugme');
            detaljiDugme.textContent = 'Detalji';

            poddiv.appendChild(detaljiDugme);
            top5Element.appendChild(poddiv);
        });
    }

    top5Element.innerHTML = top5Element.innerHTML;
}
