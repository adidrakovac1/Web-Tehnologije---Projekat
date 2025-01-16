/*
const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
}, {
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 32000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2009.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
}, {
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2003.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 4,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 68,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2025.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 69,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 40,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2026.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]
*/
let statistikaNekretnina;
let listaNekretnina;
let listaKorisnika;

async function ucitajPodatke() {
    try {
         listaNekretnina = await fetch('/nekretnine').then(response => response.json());

         listaKorisnika = await fetch('/korisnici').then(response => response.json());

        statistikaNekretnina = new StatistikaNekretnina();
        statistikaNekretnina.init(listaNekretnina, listaKorisnika);
        console.log(listaNekretnina);
        console.log(listaKorisnika);

    } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
    }
}

ucitajPodatke();

let periodi = [];
let rasponiCijena = [];

function dodajPeriod() {
    let od = parseInt(document.getElementById("period-od").value);
    let doGodina = parseInt(document.getElementById("period-do").value);
    if (od && doGodina && od <= doGodina) {
        periodi.push({ od: od, do: doGodina });
        prikaziPeriode();
    } else {
        alert("Unesite ispravan period!");
    }
}

function prikaziPeriode() {
    let lista = document.getElementById("periodi-lista");
    lista.innerHTML = periodi.map((p, i) => `<div>Period ${i + 1}: ${p.od} - ${p.do}</div>`).join("");
}

function dodajRasponCijena() {
    let od = parseInt(document.getElementById("cijena-od").value);
    let doCijena = parseInt(document.getElementById("cijena-do").value);
    if (od && doCijena && od <= doCijena) {
        rasponiCijena.push({ od: od, do: doCijena });
        prikaziRasponeCijena();
    } else {
        alert("Unesite ispravan raspon cijena!");
    }
}

function prikaziRasponeCijena() {
    let lista = document.getElementById("rasponi-lista");
    lista.innerHTML = rasponiCijena.map((r, i) => `<div>Raspon ${i + 1}: ${r.od} - ${r.do}</div>`).join("");
}

function iscrtajHistogram() {
    let rezultati = statistikaNekretnina.histogramCijena(periodi, rasponiCijena);
    let chartsContainer = document.getElementById("charts-container");

    if (!chartsContainer) {
        console.error("Element sa ID-jem 'charts-container' ne postoji.");
        return;
    }

    chartsContainer.innerHTML = "";

    periodi.forEach((period, periodIndex) => {
        let canvas = document.createElement("canvas");
        canvas.id = `chart-${periodIndex}`;
        chartsContainer.appendChild(canvas);

        let data = rasponiCijena.map((raspon, rasponIndex) => {
            let rezultat = rezultati.find(r =>
                r.indeksPerioda === periodIndex && r.indeksRasporedaCijena === rasponIndex
            );
            return rezultat ? rezultat.brojNekretnina : 0;
        });

        if (data.every(val => val === 0)) {
            console.warn(`Nema podataka za period: ${period.od} - ${period.do}`);
        }

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: rasponiCijena.map(r => `${r.od} - ${r.do}`),
                datasets: [
                    {
                        label: `Nekretnine (${period.od} - ${period.do})`,
                        data: data,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
                scales: {
                    x: { title: { display: true, text: "Rasponi Cijena" } },
                    y: {
                        title: { display: true, text: "Broj Nekretnina" },
                        beginAtZero: true,
                    },
                },
            },
        });
    });
}
function prikaziProsjecneKvadrature() {
    let kriteriji = {
        tip_nekretnine: document.getElementById("tip_nekretnine").value.trim(),
        naziv: document.getElementById("naziv").value.trim(),
        min_cijena: document.getElementById("min_cijena").value.trim(),
        max_cijena: document.getElementById("max_cijena").value.trim(),
        min_kvadratura: document.getElementById("min_kvadratura").value.trim(),
        max_kvadratura: document.getElementById("max_kvadratura").value.trim(),
        tip_grijanja: document.getElementById("tip_grijanja").value.trim(),
        lokacija: document.getElementById("lokacija").value.trim(),
        min_godina_izgradnje: document.getElementById("min_godina_izgradnje").value.trim(),
        max_godina_izgradnje: document.getElementById("max_godina_izgradnje").value.trim(),
        min_datum_objave: document.getElementById("min_datum_objave").value.trim(),
        max_datum_objave: document.getElementById("max_datum_objave").value.trim(),
        opis: document.getElementById("opis").value.trim()
    };

    if (
        !validacija(kriteriji.min_cijena, "Minimalna cijena") ||
        !validacija(kriteriji.max_cijena, "Maksimalna cijena") ||
        !validacija(kriteriji.min_kvadratura, "Minimalna kvadratura") ||
        !validacija(kriteriji.max_kvadratura, "Maksimalna kvadratura") ||
        !validacija(kriteriji.min_godina_izgradnje, "Minimalna godina izgradnje") ||
        !validacija(kriteriji.max_godina_izgradnje, "Maksimalna godina izgradnje")
    ) {
        return;
    }

    kriteriji.min_cijena = parseFloat(kriteriji.min_cijena);
    kriteriji.max_cijena = parseFloat(kriteriji.max_cijena);
    kriteriji.min_kvadratura = parseFloat(kriteriji.min_kvadratura);
    kriteriji.max_kvadratura = parseFloat(kriteriji.max_kvadratura);
    kriteriji.min_godina_izgradnje = parseInt(kriteriji.min_godina_izgradnje);
    kriteriji.max_godina_izgradnje = parseInt(kriteriji.max_godina_izgradnje);

    let prosjek = statistikaNekretnina.prosjecnaKvadratura(kriteriji);

    let element = document.getElementById("prosjecne-kvadrature");
    element.innerHTML = `<div>Prosječna kvadratura: ${prosjek} m²</div>`;
}


function prikaziOutliere() {
    let kriteriji = {
        tip_nekretnine: document.getElementById("tip_nekretnine").value.trim(),
        naziv: document.getElementById("naziv").value.trim(),
        min_cijena: document.getElementById("min_cijena").value.trim(),
        max_cijena: document.getElementById("max_cijena").value.trim(),
        min_kvadratura: document.getElementById("min_kvadratura").value.trim(),
        max_kvadratura: document.getElementById("max_kvadratura").value.trim(),
        tip_grijanja: document.getElementById("tip_grijanja").value.trim(),
        lokacija: document.getElementById("lokacija").value.trim(),
        min_godina_izgradnje: document.getElementById("min_godina_izgradnje").value.trim(),
        max_godina_izgradnje: document.getElementById("max_godina_izgradnje").value.trim(),
        min_datum_objave: document.getElementById("min_datum_objave").value.trim(),
        max_datum_objave: document.getElementById("max_datum_objave").value.trim(),
        opis: document.getElementById("opis").value.trim()
    };
    if (
        !validacija(kriteriji.min_cijena, "Minimalna cijena") ||
        !validacija(kriteriji.max_cijena, "Maksimalna cijena") ||
        !validacija(kriteriji.min_kvadratura, "Minimalna kvadratura") ||
        !validacija(kriteriji.max_kvadratura, "Maksimalna kvadratura") ||
        !validacija(kriteriji.min_godina_izgradnje, "Minimalna godina izgradnje") ||
        !validacija(kriteriji.max_godina_izgradnje, "Maksimalna godina izgradnje")
    ) {
        return;
    }

    kriteriji.min_cijena = parseFloat(kriteriji.min_cijena);
    kriteriji.max_cijena = parseFloat(kriteriji.max_cijena);
    kriteriji.min_kvadratura = parseFloat(kriteriji.min_kvadratura);
    kriteriji.max_kvadratura = parseFloat(kriteriji.max_kvadratura);
    kriteriji.min_godina_izgradnje = parseInt(kriteriji.min_godina_izgradnje);
    kriteriji.max_godina_izgradnje = parseInt(kriteriji.max_godina_izgradnje);

    let nazivSvojstva = document.getElementById("nazivSvojstva").value.trim();
    let dozvoljenaSvojstva = ["cijena", "kvadratura", "godina_izgradnje"];
    if (!dozvoljenaSvojstva.includes(nazivSvojstva)) {
        alert("Naziv svojstva mora biti cijena, kvadratura ili godina_izgradnje.");
        return;  
    }

    let outlier = statistikaNekretnina.outlier(kriteriji, nazivSvojstva);

    let element = document.getElementById("outliere");
    if (outlier) {
        element.innerHTML = `
            <div>Outlier: </div>
            <div>ID nekretnine: ${outlier.id}</div>
            <div>Naziv: ${outlier.naziv}</div>
            <div>Cijena: ${outlier.cijena}</div>
            <div>Kvadratura: ${outlier.kvadratura}</div>
            <div>Godina izgradnje: ${outlier.godina_izgradnje}</div>
            <div>Lokacija: ${outlier.lokacija}</div>
        `;
    } else {
        element.innerHTML = `<div>Nema outliera za odabrane kriterije.</div>`;
    }
}

function prikaziMojeNekretnine() {
    let username = document.getElementById("username").value.trim();
    let korisnik = listaKorisnika.find(k => k.username === username);
    if (!korisnik) {
        document.getElementById("moje-nekretnine").innerHTML = "<div>Korisnik nije pronađen.</div>";
        return;
    }
    let mojeNekretnine = statistikaNekretnina.mojeNekretnine(korisnik);
    let element = document.getElementById("moje-nekretnine");
    if (mojeNekretnine.length > 0) {
        element.innerHTML = `<div>Moje nekretnine:</div>` +
            mojeNekretnine.map(nekretnina => {
                return `<div>${nekretnina.naziv} - (Broj upita datog korisnika sa id-em: ${korisnik.id} za nekretninu sa id-em: ${nekretnina.id} je ${nekretnina.brojUpita})</div>`;
            }).join('');
    } else {
        element.innerHTML = "<div>Taj korisnik nema upita na datoj nekretnini.</div>";
    }
}

function prikaziSvojstva() {
    var checkBox = document.getElementById("svojstva");
    var svojstvaContainer = document.getElementById("svojstva-container");

    if (checkBox.checked == true) {
        svojstvaContainer.style.display = "block";
    } else {
        svojstvaContainer.style.display = "none";
    }
}

function validacija(vrijednost, svojstvo) {
    let broj = parseFloat(vrijednost); 
    if (vrijednost && (isNaN(broj) || !isFinite(broj))) {
        alert(`Polje "${svojstvo}" mora biti broj.`);
        return false;
    }
    return true;
}
