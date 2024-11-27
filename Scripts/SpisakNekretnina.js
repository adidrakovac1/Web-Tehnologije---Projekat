let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];

    //implementacija metoda
    let init = function (listaNekretnina, listaKorisnika) {
        this.listaNekretnina = listaNekretnina;
        this.listaKorisnika = listaKorisnika;
    }

    let filtrirajNekretnine = function (kriterij) {
        return this.listaNekretnina.filter(nekretnina => {
            if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
                return false;
            }

            // Filtriranje po minimalnoj kvadraturi
            if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
                return false;
            }

            // Filtriranje po maksimalnoj kvadraturi
            if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
                return false;
            }

            // Filtriranje po minimalnoj cijeni
            if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
                return false;
            }

            // Filtriranje po maksimalnoj cijeni
            if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
                return false;
            }

            // Filtriranje po tipu grijanja
            if (kriterij.tip_grijanja && nekretnina.tip_grijanja !== kriterij.tip_grijanja) {
                return false;
            }
    
            // Filtriranje po lokaciji
            if (kriterij.lokacija && nekretnina.lokacija !== kriterij.lokacija) {
                return false;
            }
    
            // Filtriranje po minimalnoj godini izgradnje
            if (kriterij.min_godina_izgradnje && nekretnina.godina_izgradnje <= kriterij.min_godina_izgradnje) {
                return false;
            }

            // Filtriranje po maksimalnoj godini izgradnje
            if (kriterij.max_godina_izgradnje && nekretnina.godina_izgradnje >= kriterij.max_godina_izgradnje) {
                return false;
            }

            // Filtriranje po minimalnom datumu objave
            if (kriterij.min_datum_objave && nekretnina.datum_objave <= kriterij.min_datum_objave) {
                let datumKriterij = new Date(kriterij.min_datum_objave.split('.').reverse().join('-'));
                let datumNekretnine = new Date(nekretnina.datum_objave.split('.').reverse().join('-'));
                if (datumNekretnine < datumKriterij) {
                    return false;
                }
            }

            // Filtriranje po maksimalnom datumu objave
            if (kriterij.max && nekretnina.datum_objave <= kriterij.max_datum_objave) {
                let datumKriterij = new Date(kriterij.max_datum_objave.split('.').reverse().join('-'));
                let datumNekretnine = new Date(nekretnina.datum_objave.split('.').reverse().join('-'));
                if (datumNekretnine > datumKriterij) {
                    return false;
                }
            }

            // Filtriranje po opisu
            if (kriterij.opis && nekretnina.opis && !nekretnina.opis.toLowerCase().includes(kriterij.opis.toLowerCase())) {
                return false;
            }

    
            return true;
        });
    }
    
    let ucitajDetaljeNekretnine = function (id) {
        return listaNekretnina.find(nekretnina => nekretnina.id === id) || null;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};