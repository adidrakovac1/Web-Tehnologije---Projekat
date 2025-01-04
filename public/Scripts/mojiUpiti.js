document.addEventListener("DOMContentLoaded", function() {
    function ispisiUpite(upiti) {
        const upitiContainer = document.getElementById("upitiContainer");
        upitiContainer.innerHTML = ""; 
    
        if (upiti.length === 0) {
            upitiContainer.innerHTML = "<p>Nemate nikakve upite.</p>";
        } else {
            upiti.forEach(upit => {
                const upitElement = document.createElement("div");
                upitElement.classList.add("upit");
    
                upitElement.innerHTML = `
                    <h3>Upit za nekretninu: ${upit.id}</h3>
                    <p><strong>Tip nekretnine:</strong> ${upit.naziv_nekretnine}</p>
                    <p><strong>Tip nekretnine:</strong> ${upit.tip_nekretnine}</p>
                    <p><strong>Lokacija:</strong> ${upit.lokacija}</p>
                    <p><strong>Tekst upita:</strong> ${upit.tekst_upita}</p>
                `;
                upitiContainer.appendChild(upitElement);
            });
        }    
    }

    function dohvatiUpite() {
        PoziviAjax.getMojiUpiti((error, response) => {
            if (error) {
                alert("Nemaš niti jedan upit.");
            } else {
                if (response.status === 200) {
                    ispisiUpite(response.data);
                } else {
                    alert("Greška: " + response.message);
                }
            }
        });
    }

    dohvatiUpite();
});
