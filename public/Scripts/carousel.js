function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (!glavniElement || !sviElementi || sviElementi.length === 0 || indeks < 0 || indeks >= sviElementi.length) {
        console.error("Greška parametri: Ulazni parametri nisu validni.");
        return null;
    }


    const fnLijevo = function () {
        indeks = (indeks - 1 + sviElementi.length) % sviElementi.length;
        if (indeks < 0) indeks = sviElementi.length - 1;
        if (sviElementi[indeks]) {
            glavniElement.innerHTML = sviElementi[indeks].outerHTML;
        } else {
            console.error("Greška fnLijevo: Element na indeksu " + indeks + " ne postoji.");
        }
    }

    const fnDesno = function () {
        indeks = (indeks + 1) % sviElementi.length;
        if (indeks == sviElementi.length) indeks = 0;
        if (sviElementi[indeks]) {
            glavniElement.innerHTML = sviElementi[indeks].outerHTML;
        } else {
            console.error("Greška fnDesno: Element na indeksu " + indeks + " ne postoji.");
        }
    }
    if (sviElementi.length > 0 && sviElementi[indeks]) {
        glavniElement.innerHTML = sviElementi[indeks].outerHTML;
    } else {
        console.error("Greška: Carousel nije ispravno inicijalizovan.");
        return null;
    }
    /*if (window.innerWidth < 600) {
        if (sviElementi.length > 0 && sviElementi[indeks]) {
            console.log(sviElementi[indeks]);
            let pomocna = sviElementi[indeks];
            glavniElement.innerHTML = pomocna.outerHTML;

        } else {
            console.error("Greška: Carousel nije ispravno inicijalizovan.");
            return null;
        }
    }*/
    return { fnLijevo: fnLijevo, fnDesno: fnDesno };
}
