
let StatistikaNekretnina = function () {

    let spisakNekretnina = SpisakNekretnina();
    
    let init = function (nekretnine, korisnici) {
        spisakNekretnina.init(nekretnine,korisnici);
    };

    let prosjecnaKvadratura = function (kriterij) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length === 0) return 0;

        let sumaKvadratura = 0;
        for (let i = 0; i < filtriraneNekretnine.length; i++) {
            sumaKvadratura += filtriraneNekretnine[i].kvadratura;
        }

        return sumaKvadratura / filtriraneNekretnine.length;
    };

    let outlier = function (kriterij, nazivSvojstva) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length === 0) return null;
    
        let suma = 0;
        for (let i = 0; i < spisakNekretnina.listaNekretnina.length; i++) {
            suma += spisakNekretnina.listaNekretnina[i][nazivSvojstva];
        }
        
        let srednjaVrijednost = suma / spisakNekretnina.listaNekretnina.length;
    
        let maxOdstupanje = 0;
        let outlierNekretnina = null;
        for (let i = 0; i < filtriraneNekretnine.length; i++) {
            let odstupanje = Math.abs(filtriraneNekretnine[i][nazivSvojstva] - srednjaVrijednost);
            if (odstupanje > maxOdstupanje) {
                maxOdstupanje = odstupanje;
                outlierNekretnina = filtriraneNekretnine[i];
            }
        }
    
        return outlierNekretnina;
    };

    let mojeNekretnine = function (korisnik) {
        let listaNekretnina = spisakNekretnina.listaNekretnina;
        let nekretnineKorisnika = [];
    
        for (let i = 0; i < listaNekretnina.length; i++) {
            let nekretnina = listaNekretnina[i];
            let brojUpita = 0;
    
            for (let j = 0; j < nekretnina.upiti.length; j++) {
                if (nekretnina.upiti[j].korisnik_id === korisnik.id) {
                    brojUpita++;
                }
            }
    
            if (brojUpita > 0) {
                nekretnina.brojUpita = brojUpita;
                nekretnineKorisnika.push(nekretnina);
            }
        }
    
        for (let i = 0; i < nekretnineKorisnika.length - 1; i++) {
            for (let j = i + 1; j < nekretnineKorisnika.length; j++) {
                if (nekretnineKorisnika[i].brojUpita < nekretnineKorisnika[j].brojUpita) {
                    let temp = nekretnineKorisnika[i];
                    nekretnineKorisnika[i] = nekretnineKorisnika[j];
                    nekretnineKorisnika[j] = temp;
                }
            }
        }
    
        return nekretnineKorisnika;
    };
    
    let histogramCijena = function (periodi, rasponiCijena) {
        let rezultat = [];
    
        for (let i = 0; i < periodi.length; i++) {
            let period = periodi[i];
            let nekretnineZaPeriod = [];
    
            for (let j = 0; j < spisakNekretnina.listaNekretnina.length; j++) {
                let nekretnina = spisakNekretnina.listaNekretnina[j];
                let datumObjave = new Date(nekretnina.datum_objave.split(".").reverse().join("-"));
                let godinaObjave = datumObjave.getFullYear();
                if (godinaObjave >= period.od && godinaObjave <= period.do) {
                    nekretnineZaPeriod.push(nekretnina);
                }
            }
    
            for (let k = 0; k < rasponiCijena.length; k++) {
                let raspon = rasponiCijena[k];
                let brojNekretnina = 0;
    
                for (let l = 0; l < nekretnineZaPeriod.length; l++) {
                    let nekretnina = nekretnineZaPeriod[l];
                    if (nekretnina.cijena >= raspon.od && nekretnina.cijena <= raspon.do) {
                        brojNekretnina++;
                    }
                }
    
                rezultat.push({
                    indeksPerioda: i,
                    indeksRasporedaCijena: k,
                    brojNekretnina: brojNekretnina
                });
            }
        }
    
        return rezultat;
    };

    return {
        init: init,
        prosjecnaKvadratura: prosjecnaKvadratura,
        outlier: outlier,
        mojeNekretnine: mojeNekretnine,
        histogramCijena: histogramCijena
    }
};
