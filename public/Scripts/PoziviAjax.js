const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    function ajaxRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback({ status: xhr.status, statusText: xhr.statusText }, null);
                }
            }
        };
        xhr.send(data ? JSON.stringify(data) : null);
    }

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else if (ajax.status == 401) {
                    console.log('Neuspješan zahtjev, status 401');
                    fnCallback("error", null);
                } else {
                    console.log('Nepoznat status:', ajax.status);
                }
            }
        };

        ajax.open("GET", "http://localhost:3000/korisnik/", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        // Check if user is authenticated
        if (!req.session.username) {
            // User is not logged in
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        // Get data from request body
        const { ime, prezime, username, password } = noviPodaci;

        // Read user data from the JSON file
        const users = readJsonFile('korisnici');

        // Find the user by username
        const loggedInUser = users.find((user) => user.username === req.session.username);

        if (!loggedInUser) {
            // User not found (should not happen if users are correctly managed)
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        // Update user data with the provided values
        if (ime) loggedInUser.ime = ime;
        if (prezime) loggedInUser.prezime = prezime;
        if (username) loggedInUser.adresa = adresa;
        if (password) loggedInUser.brojTelefona = brojTelefona;

        // Save the updated user data back to the JSON file
        saveJsonFile('korisnici', users);

        fnCallback(null, { poruka: 'Podaci su uspješno ažurirani' });
    }

    function impl_getNekretnine(fnCallback) {
        // Koristimo AJAX poziv da bismo dohvatili podatke s servera
        ajaxRequest('GET', '/nekretnine', null, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4 && ajax.status == 429) {
                const errorResponse = JSON.parse(ajax.response);
                fnCallback(errorResponse.greska, null);
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/login", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "username": username,
            "password": password
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/logout", true)
        ajax.send()
    }


    function getTop5Nekretnina(lokacija, fnCallback) {
        ajaxRequest("GET", `/nekretnine/top5?lokacija=${encodeURIComponent(lokacija)}`, null, (error, data) => {
            if (error) {
                return fnCallback(error, null);
            }
    
            try {
                const parsirano = JSON.parse(data);
                console.log('Uspješan zahtjev, status 200');
                fnCallback(null, parsirano);
            } catch (parseError) {
                console.log('Greška prilikom parsiranja odgovora.');
                fnCallback(parseError, null);
            }
        });
    }
    
    function getMojiUpiti(fnCallback) {
        ajaxRequest("GET", '/upiti/moji', null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const responseData = JSON.parse(data);
                    if (responseData.greska) {
                        console.log('Neuspješan zahtjev, status 401');
                        fnCallback({ status: 401, message: responseData.greska }, null);
                    } else if (Array.isArray(responseData)) {
                        if (responseData.length === 0) {
                            console.log('Neuspješan zahtjev, status 404');
                            fnCallback({ status: 404, message: 'Korisnik nema upite' }, []);
                        } else {
                            console.log('Uspješan zahtjev, status 200');
                            fnCallback(null, { status: 200, data: responseData });
                        }
                    }
                } catch (e) {
                    fnCallback(e, null);
                }
            }
        });
    }


    function getNekretnina(nekretnina_id, fnCallback) {

        ajaxRequest("GET", `/nekretnina/${nekretnina_id}`, null, (error, data) => {
            if (error) {
                console.log("Neuspješan zahtjev");
                fnCallback(error, null);
            } else {
                try {
                    const responseData = JSON.parse(data);
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, { status: 200, message: responseData });
                } catch (e) {
                    console.log("Neuspješan zahtjev.")
                    fnCallback(e, null);
                }
            }
        });
    }

    function getNextUpiti(nekretnina_id, page, fnCallback) {

        ajaxRequest("GET", `/next/upiti/nekretnina${nekretnina_id}?page=${page}`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const responseData = JSON.parse(data);
                    console.log(responseData);

                    if (responseData.length === 0) {
                        console.log('Neuspješan zahtjev, status 404');
                        fnCallback({ status: 404, message: responseData.greska }, null);
                    }
                    else if (responseData.greska) {
                        console.log('Neuspješan zahtjev, status 404');
                        fnCallback({ status: 404, message: responseData.greska }, null);
                    } else {
                        console.log('Uspješan zahtjev, status 200');
                        console.log(responseData);
                        fnCallback(null, { status: 200, message: responseData });
                    }
                } catch (e) {
                    fnCallback(e, null);
                }
            }
        });
    }

    function getInteresovanja(nekretninaId, fnCallback) {
        ajaxRequest("GET", `/nekretnina/${nekretninaId}/interesovanja`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    if (data.status === 404) {
                        console.log('Greška: Nekretnina nije pronađena');
                        fnCallback("Nekretnina nije pronađena.", null);
                    }
                    else if(data.status === 500){
                        console.log('Greška na serveru.');
                        fnCallback("Došlo je do greške na serveru", null);
                    }
                    else{
                    console.log('Raw response data:', data); 
                    console.log('Tip podatka:', typeof data);
                    const responseData = typeof data === "string" ? JSON.parse(data) : data;

                    console.log('Uspješan zahtjev, status 200');
                    console.log("Nakon parsiranja:",responseData);
                    fnCallback(null, { status: 200, message: responseData });
                    }
                } catch (e) {
                    console.log('Greška prilikom parsiranja odgovora.');
                    fnCallback(e, null);
                }
            }
        });
    }
    
    function impl_postUpit(data, fnCallback) {
        console.log("Data za upit:",data);
        ajaxRequest("POST", "/upit", data, (error, response) => {
            if (error) {
                if(error.status===401)alert("Morate biti prijavljeni da bi napisali upit");
                else if(error.status===429)alert("Imate previše postavljeni upita na ovu nekretninu");
                return fnCallback(error, null);
            }
            if(data.status === 401) {
                console.log("Neuspješan zahtjev, status 401.");
                fnCallback("Korisnik nije prijavljen.", null);
            }
            else if(data.status === 400){
                console.log("Neuspješan zahtjev, status 400.");
                fnCallback("Nekretnina nije pronađena.", null);
            }
            else if(data.status === 500){
                console.log("Neuspješan zahtjev, status 500.");
                fnCallback("Došlo je do greške na serveru.", null);
            }
            else if(data.status === 429){
                console.log("Neuspješan zahtjev, status 429.");
                fnCallback("Postavili ste previše upita za tu nekretninu.", null);
            }
            fnCallback(null, response.data);
        });
    }

    function impl_postZahtjev(data, fnCallback) {
        const nekretninaId = data.nekretninaId;
        ajaxRequest("POST", `/nekretnina/${nekretninaId}/zahtjev`, data, (error, response) => {
            console.log("Odgovor na zahtjev:",response);
            console.log("Data zahtjev:",data);
            if (error) {
                if(error.status === 401)alert("Morate biti prijavljeni da bi poslali zahtjev");
                else if(error.status === 404)alert("Uneseni datum nije ispravan (datum je u prošlosti)");
                return fnCallback(error, null);
            }
            if(data.status === 401) {
                console.log("Neuspješan zahtjev, status 401.");
                fnCallback("Korisnik nije prijavljen.", null);
            }
            else if(data.status === 500){
                console.log("Neuspješan zahtjev, status 500.");
                fnCallback("Došlo je do greške na serveru.", null);
            }
            else if(data.status === 404){
                console.log("Neuspješan zahtjev, status 404.");
                fnCallback("Nekretnina nije pronađena ili datum nije ispravan.", null);
            }
            fnCallback(null, response);
        });
    }

    function impl_postPonuda(data, fnCallback) {
        const nekretninaId = data.nekretninaId;
        ajaxRequest("POST", `/nekretnina/${nekretninaId}/ponuda`, data, (error, response) => {
            if (error) {
                if(error.status === 401)alert("Morate biti prijavljeni da bi poslali ponudu");
                else if(error.status === 429)alert("Neka od vezanih ponuda je odbijena pa ne možete postavit ponudu.");
                
                return fnCallback(error, null);
            }
            if(data.status === 401) {
                console.log("Neuspješan zahtjev, status 401.");
                fnCallback("Korisnik nije prijavljen.", null);
            }
            else if(data.status ===400){
                console.log("Neuspješan zahtjev, status 400.");
                fnCallback("Nekretnina nije pronađena ili ne postoji ponuda.", null);
            }
            else if(data.status === 500){
                console.log("Neuspješan zahtjev, status 500.");
                fnCallback("Došlo je do greške na serveru.", null);
            }
            else if(data.status === 404){
                console.log("Neuspješan zahtjev, status 404.");
                fnCallback("Vezana ponuda nije pronađena.", null);
            }
            else if(data.status===429){
                console.log("Neuspješan zahtjev, status 429.");
                fnCallback("Neka od vezani ponuda je odbijena pa ne možete poslat ponudu.", null);
            }
            fnCallback(null, response);
        });
    }

    function impl_putZahtjev(data, fnCallback) {
        const nekretninaId = data.nekretninaId;
        const zahtjevId = data.zahtjevId;
        ajaxRequest("PUT", `/nekretnina/${nekretninaId}/zahtjev/${zahtjevId}`, data, (error, response) => {
            if (error) {
                return fnCallback(error, null);
            }
            if(data.status === 401) {
                console.log("Neuspješan zahtjev, status 401.");
                fnCallback("Samo prijavljeni admin može odgovorit na zahtjev.", null);
            }
            else if(data.status ===400){
                console.log("Neuspješan zahtjev, status 400.");
                fnCallback("Parametar odobren vam mora biti true ili false ili niste naveli tekst odgovora a stavili ste da nije odobren.", null);
            }
            else if(data.status === 500){
                console.log("Neuspješan zahtjev, status 500.");
                fnCallback("Došlo je do greške na serveru.", null);
            }
            else if(data.status === 404){
                console.log("Neuspješan zahtjev, status 404.");
                fnCallback("Zahtjev nije pronađen.", null);
            }
            fnCallback(null, response);
        });
    }
    function getPonude(nekretninaId, korisnikId, fnCallback) {
        const url = korisnikId ? `/nekretnina/${nekretninaId}/ponude?korisnikId=${korisnikId}` : `/nekretnina/${nekretninaId}/ponude`;
        ajaxRequest("GET", url, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    if (data.status === 404) {
                        console.log('Greška: Nekretnina nije pronađena');
                        fnCallback("Nekretnina nije pronađena.", null);
                    } else if (data.status === 500) {
                        console.log('Greška na serveru.');
                        fnCallback("Došlo je do greške na serveru", null);
                    } else {
                        console.log('Raw response data:', data);
                        console.log('Tip podatka:', typeof data);
                        const responseData = typeof data === "string" ? JSON.parse(data) : data;
    
                        console.log('Uspješan zahtjev, status 200');
                        console.log("Nakon parsiranja:", responseData);
                        fnCallback(null, { status: 200, message: responseData });
                    }
                } catch (e) {
                    console.log('Greška prilikom parsiranja odgovora.');
                    fnCallback(e, null);
                }
            }
        });
    }    
    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getTop5Nekretnina: getTop5Nekretnina,
        getMojiUpiti: getMojiUpiti,
        getNekretnina: getNekretnina,
        getNextUpiti: getNextUpiti,
        getInteresovanja: getInteresovanja,
        postPonuda: impl_postPonuda,
        postZahtjev: impl_postZahtjev,
        putZahtjev: impl_putZahtjev,
        getPonude: getPonude
    };
})();