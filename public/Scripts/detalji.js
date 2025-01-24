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
                ispisiOsnovnoIDetalje(data.message.nekretnina);
                //ispisiUpiteCarousel(data.message.upiti);
            } else {
                alert("Greška: " + data.message.greska);
            }
        }
    });
    PoziviAjax.getInteresovanja(idNekretnine, (error, data) => {
        if (error) {
            alert("Greška: ", error);
        } else {
            if (data.status === 200) {
                console.log("Interesovanja:", data.message);
                ispisiInteresovanjaCarousel(data.message);
            } else {
                alert("Greška: " + data.message.greska);
            }
        }
    });
    const tipInteresovanja = document.getElementById("tipInteresovanja");
    const dodatnaPolja = document.getElementById("dodatna-polja");

    tipInteresovanja.addEventListener("change", async () => {
        const odabraniTip = tipInteresovanja.value;
        dodatnaPolja.innerHTML = "";

        switch (odabraniTip) {
            case "upit":

                const upitInput = document.createElement("textarea");
                upitInput.id = "tekstUpita";
                upitInput.placeholder = "Unesite vaš upit ovdje...";
                upitInput.required = true;
                const upitLabel = document.createElement("label");
                upitLabel.htmlFor = "tekstUpita";
                upitLabel.textContent = "Tekst Upita:";
                const upitDiv = document.createElement("div");
                upitDiv.appendChild(upitLabel);
                upitDiv.appendChild(upitInput);
                dodatnaPolja.appendChild(upitDiv);
                break;

            case "zahtjev":

                const zahtjevInput = document.createElement("textarea");
                zahtjevInput.id = "opisZahtjeva";
                zahtjevInput.placeholder = "Unesite opis zahtjeva ovdje...";
                zahtjevInput.required = true;
                const zahtjevLabel = document.createElement("label");
                zahtjevLabel.htmlFor = "opisZahtjeva";
                zahtjevLabel.textContent = "Opis Zahtjeva:";
                const zahtjevDiv = document.createElement("div");
                zahtjevDiv.appendChild(zahtjevLabel);
                zahtjevDiv.appendChild(zahtjevInput);
                dodatnaPolja.appendChild(zahtjevDiv);

                const datumZahtjevaInput = document.createElement("input");
                datumZahtjevaInput.type = "date";
                datumZahtjevaInput.id = "trazeniDatum";
                datumZahtjevaInput.required = true;
                const datumZahtjevaLabel = document.createElement("label");
                datumZahtjevaLabel.htmlFor = "trazeniDatum";
                datumZahtjevaLabel.textContent = "Traženi Datum:";
                const datumZahtjevaDiv = document.createElement("div");
                datumZahtjevaDiv.appendChild(datumZahtjevaLabel);
                datumZahtjevaDiv.appendChild(datumZahtjevaInput);
                dodatnaPolja.appendChild(datumZahtjevaDiv);
                break;

            case "ponuda":

                const ponudaInput = document.createElement("input");
                ponudaInput.id = "iznosPonude";
                ponudaInput.placeholder = "Unesite iznos ponude...";
                ponudaInput.required = true;
                const ponudaLabel = document.createElement("label");
                ponudaLabel.htmlFor = "iznosPonude";
                ponudaLabel.textContent = "Iznos Ponude:";
                const ponudaDiv = document.createElement("div");
                ponudaDiv.appendChild(ponudaLabel);
                ponudaDiv.appendChild(ponudaInput);
                dodatnaPolja.appendChild(ponudaDiv);

                const select = document.createElement("select");
                select.id = "idVezanePonude";
                const selectLabel = document.createElement("label");
                selectLabel.htmlFor = "idVezanePonude";
                selectLabel.textContent = "ID Vezane Ponude:";
                const selectDiv = document.createElement("div");
                selectDiv.appendChild(selectLabel);
                selectDiv.appendChild(select);
                dodatnaPolja.appendChild(selectDiv);

                const tekstPonudeInput = document.createElement("textarea");
                tekstPonudeInput.id = "tekstPonude";
                tekstPonudeInput.placeholder = "Unesite tekst ponude...";
                tekstPonudeInput.required = true;
                const tekstPonudeLabel = document.createElement("label");
                tekstPonudeLabel.htmlFor = "tekstPonude";
                tekstPonudeLabel.textContent = "Tekst Ponude:";
                const tekstPonudeDiv = document.createElement("div");
                tekstPonudeDiv.appendChild(tekstPonudeLabel);
                tekstPonudeDiv.appendChild(tekstPonudeInput);
                dodatnaPolja.appendChild(tekstPonudeDiv);

                const datumPonudeInput = document.createElement("input");
                datumPonudeInput.type = "date";
                datumPonudeInput.id = "datumPonude";
                datumPonudeInput.required = true;
                const datumPonudeLabel = document.createElement("label");
                datumPonudeLabel.htmlFor = "datumPonude";
                datumPonudeLabel.textContent = "Datum Ponude:";
                const datumPonudeDiv = document.createElement("div");
                datumPonudeDiv.appendChild(datumPonudeLabel);
                datumPonudeDiv.appendChild(datumPonudeInput);
                dodatnaPolja.appendChild(datumPonudeDiv);

                const selectStatus = document.createElement("select");
                selectStatus.id = "statusPonude";
                const selectStatusLabel = document.createElement("label");
                selectStatusLabel.htmlFor = "statusPonude";
                selectStatusLabel.textContent = "Status ponude:";
                const selectStatusDiv = document.createElement("div");
                selectStatusDiv.appendChild(selectStatusLabel);
                selectStatusDiv.appendChild(selectStatus);
                const nacekanju = document.createElement("option");
                const odbijeno = document.createElement("option");
                const odobreno = document.createElement("option");

                nacekanju.value = "";
                nacekanju.text = "null";
                
                odbijeno.value = "true";
                odbijeno.text = "Odbijena";

                odobreno.value = "false";
                odobreno.text = "Odobrena";
                selectStatus.appendChild(nacekanju);
                selectStatus.appendChild(odbijeno);
                selectStatus.appendChild(odobreno);
                dodatnaPolja.appendChild(selectStatusDiv);


                const loggedInUser = await fetch('/trenutnoPrijavljen').then(response => response.json());
                const nekretninaId = idNekretnine;
                const korisnikId = loggedInUser.id;
                const isAdmin = loggedInUser.admin === true;

                PoziviAjax.getPonude(nekretninaId, isAdmin ? null : korisnikId, (error, result) => {
                    if (error) {
                        console.error('Greška pri dohvatanju ponuda:', error);
                        return;
                    }

                    const ponude = result.message;
                    const nullOption = document.createElement("option");
                    nullOption.value = "";
                    nullOption.text = "null";
                    select.appendChild(nullOption);
                    console.log("logiran je:",loggedInUser);
                    if(loggedInUser.error){
                        select.disabled=true;
                    }
                    else if (ponude.length === 0) {
                        select.disabled = true;
                    } else {
                        ponude.forEach(ponuda => {
                            const option = document.createElement("option");
                            option.value = ponuda.id;
                            option.text = ponuda.id;
                            select.appendChild(option);
                        });
                    }
                });

                break;

            default:
                dodatnaPolja.innerHTML = "";
        }
    });

    document.querySelector("#interesovanjeForma .posaljiInteresovanje").addEventListener("click", () => {
        const tip = tipInteresovanja.value;
        let data = {};

        if (tip === "upit") {
            data.tekst = document.getElementById("tekstUpita").value;
            data.nekretninaId = idNekretnine;
            if(!data.tekst){
                alert("Niste unijeli tekst upita!");
                return;
            }
            PoziviAjax.postUpit(data, (error, response) => {
                if (error) {
                    console.error("Greška prilikom slanja upita:", error);
                    return;
                }
                alert("Poslali ste upit!");
                location.reload();
            });
        } else if (tip === "zahtjev") {
            data.nekretninaId = idNekretnine;
            data.tekst = document.getElementById("opisZahtjeva").value;
            data.trazeniDatum = new Date(document.getElementById("trazeniDatum").value);
            if(!data.tekst || !data.trazeniDatum){
                alert("Niste unijeli tekst zahtjeva ili traženi datum zahtjeva!");
                return;
            }
            console.log("Data u detaljima:", data);
            PoziviAjax.postZahtjev(data, (error, response) => {
                console.log(data);
                if (error) {
                    console.error("Greška prilikom slanja zahtjeva:", error);
                    return;
                }
                alert("Poslali ste zahtjev!");
                location.reload();
            });
        } else if (tip === "ponuda") {
            data.nekretninaId = idNekretnine;
            data.tekst = document.getElementById("tekstPonude").value;
            data.datumPonude = new Date(document.getElementById("datumPonude").value);
            data.ponudaCijene = parseInt(document.getElementById("iznosPonude").value);
            data.idVezanePonude = document.getElementById("idVezanePonude").value;
            data.odbijenaPonuda = document.getElementById("statusPonude").value;
            if(!data.tekst || !data.datumPonude || !data.ponudaCijene){
                alert("Niste unijeli tekst, datum ponude ili cijunu ponude!");
                return;
            }
            PoziviAjax.postPonuda(data, (error, response) => {
                if (error) {
                    console.error("Greška prilikom slanja ponude:", error);
                    return;
                }
                console.log("status;",data.idVezanePonude);
                console.log(data);
                alert("Poslali ste ponudu!");
                location.reload();
            });

        }
    });
    function posaljiIzmjene(data, callback) {
        PoziviAjax.putZahtjev(data, (error, response) => {
            if (error) {
                console.error("Greška prilikom slanja odgovora na zahtjev:", error);
                return;
            }
            alert("Odgovor uspješno poslat!");
            location.reload();
        });
    }
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("posalji-odgovor")) {
            event.preventDefault();
            const form = event.target.closest(".odgovor-forma");

            if (!form) return;

            const zahtjevId = form.getAttribute("data-zahtjev-id");
            const nekretninaId = idNekretnine;
            const odgovor = form.querySelector("textarea[name='odgovor']").value;
            const odobreno = form.querySelector("select[name='odobreno']").value === "true";

            const data = {
                zahtjevId: zahtjevId,
                odobren: odobreno,
                addToTekst: odgovor,
                nekretninaId: nekretninaId
            };

            console.log("Slanje podataka:", data);
            posaljiIzmjene(data);
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
            <p><strong>Datum objave oglasa:</strong> ${formatDate(podaci.datum_objave)}</p>
        </div>
        <div id="opis">
            <p><strong>Opis:</strong> ${podaci.opis}</p>
        </div>
    `;
}
async function ispisiInteresovanjaCarousel(data) {
    console.log("Interesovanja:", data);


    const interesovanjaElement = document.getElementById("carousel-interesovanja");
    const korisnici = await fetch('/korisnici').then(response => response.json());

    const loggedInUser = await fetch('/trenutnoPrijavljen').then(response => response.json());
    console.log("Prijavljeni korisnik:", loggedInUser);

    interesovanjaElement.innerHTML = '';
    const container = document.createElement("div");
    container.classList.add("carousel-container");
    interesovanjaElement.appendChild(container);

    const { upiti, zahtjevi, ponude } = data;
    const interesovanja = [...upiti, ...zahtjevi, ...ponude];

    for (let interesovanje of interesovanja) {
        const korisnik = korisnici.find(k => k.id === interesovanje.korisnikId);
        const korisnikIme = korisnik ? korisnik.username : "Nepoznato";

        let content = "";

        if (upiti.includes(interesovanje)) {
            content += `<p><strong>ID:</strong> ${interesovanje.id}</p>`;
            content += `<p><strong>Tekst upita:</strong> ${interesovanje.tekst}</p>`;
            content += `<p><strong>Korisnik:</strong> ${korisnikIme}</p>`;
        } else if (zahtjevi.includes(interesovanje) && loggedInUser) {
            if (loggedInUser.admin === true || loggedInUser.id === interesovanje.korisnikId) {
                content += `<p><strong>ID:</strong> ${interesovanje.id}</p>`;
                content += `<p><strong>Tekst zahtjeva:</strong> ${interesovanje.tekst}</p>`;
                const datumFormatiran = formatDate(interesovanje.trazeniDatum);
                content += `<p><strong>Datum:</strong> ${datumFormatiran}</p>`;
                content += `<p><strong>Status:</strong> ${
                    interesovanje.odobren === null 
                      ? "Nije obrađeno" 
                      : interesovanje.odobren 
                        ? "Odobrena" 
                        : "Odbijena"
                  }</p>`;

                if (loggedInUser.admin === true) {
                    content += `<p><strong>Nekretnina id:</strong> ${interesovanje.nekretninaId}</p>`;
                    content += `<p><strong>Korisnik id:</strong> ${interesovanje.korisnikId}</p>`;
                }
                if (loggedInUser && loggedInUser.admin === true && interesovanje.odobren===null) {
                    content += `
                        <form class="odgovor-forma" data-zahtjev-id="${interesovanje.id}">
                            <textarea name="odgovor" placeholder="Unesite vaš odgovor..."></textarea><br>
                            <label for="odobreno">Status:</label><br>
                                <select name="odobreno" id="odobreno">
                                    <option value="true">Odobreno</option>
                                    <option value="false">Odbijeno</option>
                                </select>
                            <button type="button" class="posalji-odgovor">Odgovori</button>
                        </form>
                    `;
                }
            }
        } else if (ponude.includes(interesovanje)) {
            content += `<p><strong>ID:</strong> ${interesovanje.id}</p>`;
            content += `<p><strong>Tekst ponude:</strong> ${interesovanje.tekst}</p>`;
            content += `<p><strong>Status:</strong> ${
                interesovanje.odbijenaPonuda === null 
                  ? "Na čekanju" 
                  : interesovanje.odbijenaPonuda 
                    ? "Odbijena" 
                    : "Odobrena"
              }</p>`;
              if (loggedInUser.admin === true || loggedInUser.id === interesovanje.korisnikId) {
                content += `<p><strong>Cijena ponude:</strong> ${interesovanje.cijenaPonude}</p>`;
              }
        }

        if (content) {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("carousel-item");
            itemDiv.innerHTML = content;
            container.appendChild(itemDiv);
        }
    }

    let sviElementi = [...container.getElementsByClassName("carousel-item")];
    if (sviElementi.length === 0) {
        container.innerHTML = "<p>Nema dostupnih interesovanja.</p>";
        return;
    }

    let trenutniIndex = 0;
    prikaziTrenutnoInteresovanje(sviElementi, trenutniIndex);

    document.getElementById("prev").addEventListener("click", () => {
        trenutniIndex = trenutniIndex > 0 ? trenutniIndex - 1 : sviElementi.length - 1;
        prikaziTrenutnoInteresovanje(sviElementi, trenutniIndex);
    });

    document.getElementById("next").addEventListener("click", () => {
        trenutniIndex = trenutniIndex < sviElementi.length - 1 ? trenutniIndex + 1 : 0;
        prikaziTrenutnoInteresovanje(sviElementi, trenutniIndex);
    });
}



function prikaziTrenutnoInteresovanje(sviElementi, trenutniIndex) {
    sviElementi.forEach((element, index) => {
        element.style.display = index === trenutniIndex ? 'block' : 'none';
    });
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
                <p><strong>Datum objave oglasa:</strong> ${formatDate(nekretnina.datum_objave)}</p>
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

function formatDate(date) {
    if (typeof date === 'string' || date instanceof String) {
        date = new Date(date);
    }
    if (!(date instanceof Date)) {
        console.error('Pogrešan tip podatka za datum:', date);
        return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}
//stara implementacija
async function ispisiUpiteCarousel(upiti) {
    console.log("Ovde kad ocu ispisat sam: ", upiti);
    const upitElement = document.getElementById("carousel-upit");
    const korisnici = await fetch('/korisnici').then(response => response.json());
    //console.log(korisnici);
    //const korisnikMap = {};
    //korisnici.forEach(korisnik => {
    //korisnikMap[korisnik.id] = korisnik.username;
    //});

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
        const korisnik = korisnici.find(k => k.id === upit.korisnikId);
        console.log("korisnik je:", korisnik);

        const korisnikIme = korisnik.username || "undefined";
        //const korisnikIme = korisnikMap[upit.id] || "undefined";

        const upitDiv = document.createElement("div");
        upitDiv.classList.add("carousel-item");
        upitDiv.innerHTML = `
            <div class="upit">
                <p><strong>Korisnik:</strong> ${korisnikIme}</p>
                <p><strong>Tekst upita:</strong> ${upit.tekst}</p>
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

        if (trenutniIndex < sviElementi.length - 1) {
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
                    trenutniIndex = 0;
                    prikaziTrenutniUpit(sviElementi, trenutniIndex);
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
                            existing.korisnik_id === upit.korisnikId && existing.tekst_upita === upit.tekst
                        )
                    ).slice(0, 3);

                    console.log("Novi upiti nakon filtra:", noviUpiti);

                    console.log("Trenutno učitani upiti:", trenutnoUcitaniUpiti);
                    console.log("Novi upiti s API-ja:", data.message);

                    if (noviUpiti.length > 0) {
                        trenutnaStranica++;
                        console.log("stranica", trenutnaStranica);
                        trenutnoUcitaniUpiti = [...trenutnoUcitaniUpiti, ...noviUpiti];
                        console.log("Novi upiti nakon učitavanja:", trenutnoUcitaniUpiti);

                        for (let upit of noviUpiti) {
                            //const korisnikIme = korisnikMap[upit.id] || "undefined";
                            const korisnik = korisnici.find(k => k.id === upit.korisnikId);
                            console.log("korisnik je:", korisnik);

                            const korisnikIme = korisnik.username || "undefined";
                            const upitDiv = document.createElement("div");
                            upitDiv.classList.add("carousel-item");
                            upitDiv.innerHTML = `
                                            <div class="upit">
                                                <p><strong>Korisnik:</strong> ${korisnikIme}</p>
                                                <p><strong>Tekst upita:</strong> ${upit.tekst}</p>
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
            trenutniIndex = 0;
            prikaziTrenutniUpit(sviElementi, trenutniIndex);
        }
    });

    function prikaziTrenutniUpit(sviElementi, trenutniIndex) {
        sviElementi.forEach((element, index) => {
            element.style.display = index === trenutniIndex ? 'block' : 'none';
        });
    }
}